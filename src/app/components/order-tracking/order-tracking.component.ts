import {Component} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {Card} from "primeng/card";
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputText} from "primeng/inputtext";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {InputGroupAddon} from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-order-tracking',
  imports: [
    Button,
    ButtonDirective,
    Card,
    FloatLabel,
    InputGroup,
    InputText,
    ReactiveFormsModule,
    Tooltip,
    InputGroupAddon
  ],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss'
})
export class OrderTrackingComponent {
  trackingForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.trackingForm = fb.group({
      tracker: [null, Validators.required],
    })
  }

  submit() {
    if (this.trackingForm.valid) {
      const trackerValue = this.trackingForm.get('tracker')?.value;
      this.router.navigate(['user/order', trackerValue]).then();
    }
  }
}
