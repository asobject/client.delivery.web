import {Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {JwtPayload, JwtService} from '../../_services/auth/jwt.service';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {Tag} from 'primeng/tag';
import {NgIf} from '@angular/common';
import {Password} from 'primeng/password';
import {Tooltip} from 'primeng/tooltip';
import {AuthService} from '../../_services/auth/auth.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-personal-info',
  imports: [
    Card,
    InputGroup,
    InputGroupAddon,
    Button,
    InputText,
    ReactiveFormsModule,
    FloatLabel,
    Tag,
    NgIf,
    Password,
    Tooltip
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  payload!:JwtPayload;
  personalForm!: FormGroup;
  loadingFirstName:boolean = false;
  loadingLastName:boolean = false;
  constructor(private jwtService: JwtService,private  fb: FormBuilder,private  auth: AuthService,private  messageService: MessageService) {
  }
  ngOnInit() {
    this.payload = this.jwtService.jwtPayload;
    this.personalForm = this.fb.group({
      firstName: [this.payload.firstName, Validators.required],
      lastName: [this.payload.lastName, Validators.required],
    })
  }

  editFirstName() {
    this.loadingFirstName = true;
    this.auth.editFirstName(this.personalForm.get('firstName')?.value).pipe(
      takeUntil(this.destroy$)
      , finalize(() => this.loadingFirstName = false)
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Имя измено, изменения вступять в слиу совсем скоро',
          life: 5000
        });
      },
      error: () => {
      }
    });
  }

  editLastName() {
    this.loadingLastName = true;
    this.auth.editLastName( this.personalForm.get('lastName')?.value).pipe(
      takeUntil(this.destroy$)
      , finalize(() => this.loadingLastName = false)
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Фамилия измена, изменения вступять в слиу совсем скоро',
          life: 5000
        });
      },
      error: () => {
      }
    });
  }

  sendEmailConfirmation() {

  }

  resendConfirmation() {

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
