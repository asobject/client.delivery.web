import { Component } from '@angular/core';
import {RedirectOrderComponent} from '../redirect-order/redirect-order.component';
import {OrderTrackingComponent} from '../order-tracking/order-tracking.component';

@Component({
  selector: 'app-home',
  imports: [
    RedirectOrderComponent,
    OrderTrackingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
