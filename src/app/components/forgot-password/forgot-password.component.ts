import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from "primeng/card";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../_services/auth/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {StorageService} from '../../_services/storage/storage.service';
import {Router} from '@angular/router';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-forgot-password',
  imports: [
    Card,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    ButtonDirective,
    Ripple
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotForm: FormGroup;
  loading = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {
    this.forgotForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if(this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.forgotPassword({email: this.forgotForm.get('email')?.value}).pipe(
      takeUntil(this.destroy$)
      , finalize(() => {this.loading = false})
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Письмо для восстановления пароля отправлено на указанную почту',
          life: 5000
        });
      },
      error: () => {
      }
    });
  }
}
