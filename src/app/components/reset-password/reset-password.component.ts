import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from "primeng/card";
import {FloatLabel} from 'primeng/floatlabel';
import {Password} from 'primeng/password';
import {NgClass} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../_services/auth/auth.service';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [
    Card,
    FloatLabel,
    Password,
    NgClass,
    ButtonDirective,
    Ripple,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  loading = false;
  private destroy$: Subject<void> = new Subject<void>();
  private queryToken!: string;
  private querySub!: string;

  constructor(private fb: FormBuilder,private route:ActivatedRoute,private  router:Router, private authService: AuthService, private messageService: MessageService) {
    this.resetForm = this.fb.group({
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
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (!data['token'] || !data['sub'] ) {
        this.router.navigate(['/']).then();
        return;
      }
      this.queryToken = data['token'];
      this.querySub = data['sub'];
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.resetForm.invalid)
      return;
    this.loading = true;
    this.authService.resetPassword({sub:this.querySub,token:this.queryToken,newPassword:this.resetForm.get('newPassword')?.value}).pipe(
      takeUntil(this.destroy$)
      , finalize(() => {this.loading = false})
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Пароль успешно восстановлен',
          life: 5000
        });
        this.router.navigate(['/login']).then();
      },
      error: () => {
      }
    });
  }
}
