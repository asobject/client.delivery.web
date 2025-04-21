import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {OrderService} from '../../_services/order/order.service';
import {getPointTypeLabel} from '../../_enums/point-type.enum';
import {OrderPointChangeDTO} from '../../_models/order-point-changeDTO';
import {OrderStatusChangeDTO} from '../../_models/order-status-changeDTO';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {getOrderStatusLabel, getOrderStatusSeverity} from '../../_enums/order-status.enum';

@Component({
  selector: 'app-history-changes',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Card,
    Tag
  ],
  templateUrl: './history-changes.component.html',
  styleUrl: './history-changes.component.scss'
})
export class HistoryChangesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  points!:OrderPointChangeDTO[];
  statuses!:OrderStatusChangeDTO[];

  constructor(private route: ActivatedRoute, private orderService: OrderService) {
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: params => {
        const tracker = params['tracker'];
        this.orderService.getOrderChanges(tracker).pipe(
          takeUntil(this.destroy$)
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

  protected readonly getPointTypeLabel = getPointTypeLabel;
  protected readonly getOrderStatusLabel = getOrderStatusLabel;
  protected readonly getOrderStatusSeverity = getOrderStatusSeverity;
}
