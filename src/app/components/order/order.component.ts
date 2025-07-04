import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {finalize, Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../_services/order/order.service";
import {OrderDTO} from "../../_models/orderDTO";
import {getOrderStatusLabel, getOrderStatusSeverity} from "../../_enums/order-status.enum";
import {NgIf} from "@angular/common";
import {Card} from "primeng/card";
import {Skeleton} from "primeng/skeleton";

@Component({
    selector: 'app-order',
    imports: [
        Tag,
        NgIf,
        Card,
        Skeleton,
    ],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    loading: boolean = true;
    order!: OrderDTO;

    constructor(private route: ActivatedRoute, private orderService: OrderService) {
    }

    ngOnInit() {
        const tracker = this.route.snapshot.paramMap.get('tracker');
        this.orderService.getOrder(tracker!).pipe(
            takeUntil(this.destroy$)
            , finalize(() => this.loading = false)
        ).subscribe({
            next: (response) => {
                this.order = response.order;
            },
            error: () => {
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
