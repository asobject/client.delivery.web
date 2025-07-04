import {Component, OnDestroy} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Card} from 'primeng/card';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Ripple} from 'primeng/ripple';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../_services/auth/auth.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {NgClass, NgIf} from '@angular/common';
import {Password} from 'primeng/password';
import {Message} from 'primeng/message';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [
    Button,
    ButtonDirective,
    Card,
    FloatLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Ripple,
    RouterLink,
    NgClass,
    Password,
    Message,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  loading = false;
  loginAlreadyExists = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private  messageService: MessageService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    }, {validator: this.passwordsMatch});
  }

  private passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  submit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const {firstName, email, password} = this.registerForm.value;
    this.authService.register({firstName, email, password})
      .pipe(
        takeUntil(this.destroy$), finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Учетная запись создана',
            life: 3000
          });
          this.router.navigate(['/login']).then();
        },
        error: (err) => {
          this.loginAlreadyExists = err.error.type === "AlreadyExistsException";
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
