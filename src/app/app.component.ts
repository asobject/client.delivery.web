import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {Toast, ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from 'primeng/api';
import { ConfirmPopupModule} from 'primeng/confirmpopup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ ToastModule,MessageService,ConfirmPopupModule, ConfirmationService]
})
export class AppComponent {
  title = 'MyDelivery';
}
