import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {finalize, Subject, takeUntil} from 'rxjs';
import {OrderService} from '../../_services/order/order.service';
import {getPointTypeLabel} from '../../_enums/point-type.enum';
import {OrderPointChangeDTO} from '../../_models/order-point-changeDTO';
import {OrderStatusChangeDTO} from '../../_models/order-status-changeDTO';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {getOrderStatusLabel, getOrderStatusSeverity} from '../../_enums/order-status.enum';
import {NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-history-changes',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Card,
    Tag,
    NgIf,
    Skeleton
  ],
  templateUrl: './history-changes.component.html',
  styleUrl: './history-changes.component.scss'
})
export class HistoryChangesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  loading: boolean=true;
  points!:OrderPointChangeDTO[];
  statuses!:OrderStatusChangeDTO[];

  constructor(private route: ActivatedRoute, private orderService: OrderService) {
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = true)
    ).subscribe({
      next: params => {
        const tracker = params['tracker'];
        this.orderService.getOrderChanges(tracker).pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading = false)
        ).subscribe({
          next: (response) => {
            this.points=response.orderPointChanges;
            this.statuses=response.orderStatusChanges;
          },
          error: () => {
          }
        });
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getOrderStatusLabel = getOrderStatusLabel;
  protected readonly getOrderStatusSeverity = getOrderStatusSeverity;
}
