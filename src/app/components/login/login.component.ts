import {Component, OnDestroy} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import {FloatLabel} from 'primeng/floatlabel';
import {AuthService} from '../../_services/auth/auth.service';
import {StorageService} from '../../_services/storage/storage.service';
import {Router, RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, Subject, takeUntil} from 'rxjs';
import {Password} from 'primeng/password';
import {Message} from 'primeng/message';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ButtonDirective,
    Ripple,
    InputText,
    FloatLabel,
    Card,
    ReactiveFormsModule,
    Button,
    RouterLink,
    Password,
    Message,
    NgClass,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  loading: boolean = false;
  loginNotFound: boolean = false;
  passwordIncorrect: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.loginForm.invalid)
      return;
    const {email, password} = this.loginForm.value;
    this.login(email, password);
  }

  login(email: string, password: string): void {
    this.loading = true;
    this.authService.login({email, password}).pipe(
      takeUntil(this.destroy$), finalize(() => this.loading = false),
    ).subscribe({
      next: (token) => {
        this.storageService.setAccessToken(token);
        this.router.navigate(['/']).then();
      },
      error: (err) => {
        this.loginNotFound = err.error.type === "NotFoundException";
        this.passwordIncorrect = err.error.type === "PasswordIncorrectException";
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openForgotPassword() {
    const url = this.router.createUrlTree([`forgot-password`]).toString();
    window.open(url, '_blank');
  }
}
