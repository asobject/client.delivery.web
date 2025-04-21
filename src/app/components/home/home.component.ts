import { Component } from '@angular/core';
import {RedirectOrderComponent} from '../redirect-order/redirect-order.component';

@Component({
  selector: 'app-home',
  imports: [
    RedirectOrderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
