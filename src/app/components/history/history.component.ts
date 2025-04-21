import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrderService} from '../../_services/order/order.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {getOrderStatusSeverity, getOrderStatusLabel} from '../../_enums/order-status.enum';
import {Button} from 'primeng/button';
import {OrderDTO} from '../../_models/orderDTO';
import {Router} from '@angular/router';
import {Accordion, AccordionModule} from 'primeng/accordion';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-history',
  imports: [
    Paginator,
    TableModule,
    Card,
    Tag,
    Button, AccordionModule, CommonModule, Button
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  totalRecords: number = 0;
  orders!:OrderDTO[];
  loading = false;
  first: number = 0;

  rows: number = 5;
  @ViewChild(Paginator) paginator!: Paginator;
  @ViewChild(Accordion) accordion!: Accordion;

  constructor(private orderService: OrderService,private  router: Router ) {}
  ngOnInit() : void {
    this.loading = true;

       this.orderService.getOrders(this.first+1, this.rows)
      .pipe(
        takeUntil(this.destroy$), // Отписываемся при уничтожении компонента
        finalize(() => (this.loading = false)) // Устанавливаем loading в false после завершения
      )
      .subscribe({
        next: result => {
          this.orders = result.data;
          this.totalRecords = result.totalRecords;
        },
        error: () => {
        }
      });
  }

  loadOrders($event: PaginatorState): void {
    this.loading = true;
    const page = $event?.first ?? 0;
    const pageSize = $event?.rows ?? this.rows;
    this.orderService.getOrders(page + 1, pageSize).pipe(takeUntil(this.destroy$),finalize(()=>this.loading=false)).subscribe(
      {
        next: result => {
          this.orders = [];
          this.orders = result.data;
          this.totalRecords = result.totalRecords;
        },
        error: () => {
        }
      }
    );
  }
  ngOnDestroy() : void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getOrderStatusLabel = getOrderStatusLabel;

  showInfo(tracker: string) {
    const url = this.router.createUrlTree([`/users/me/orders/${tracker}/changes`]).toString();
    window.open(url, '_blank');
  }

  protected readonly getOrderStatusSeverity = getOrderStatusSeverity;

  onPageChange($event: PaginatorState) {
    this.first = $event.first ?? 0;
    this.rows = $event.rows ?? this.rows;
    this.loadOrders($event);
    this.accordion.updateValue(-1);
  }
}
