import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {Card} from "primeng/card";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {Router, RouterLink} from "@angular/router";
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../_services/auth/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {StorageService} from '../../_services/storage/storage.service';
import {Password} from 'primeng/password';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [
    ButtonDirective,
    FloatLabel,
    ReactiveFormsModule,
    Ripple,
    Password,
    NgClass
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit,OnDestroy{
  changeForm: FormGroup;
  loading = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService) {
    this.changeForm = this.fb.group({
      currentPassword: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordsMatch });
  }
  private passwordsMatch(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.changeForm.invalid)
      return;
    this.loading = true;
    this.authService.changePassword({currentPassword:this.changeForm.get('currentPassword')?.value,newPassword:this.changeForm.get('newPassword')?.value}).pipe(
      takeUntil(this.destroy$)
      , finalize(() => {this.loading = false})
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Пароль изменен',
          life: 5000
        });
        this.authService.forceLogout();
      },
      error: () => {
      }
    });
  }
}
