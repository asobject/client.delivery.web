import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../_services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-confirm-email',
  imports: [
    Card,
    NgIf,
    Skeleton,
    Tag
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private queryToken!:string;
  private querySub!:string;
  success: boolean|null = null;
  constructor(public route: ActivatedRoute, private  router:Router,public authService: AuthService) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (!data['token'] || !data['sub'] ) {
        this.router.navigate(['/']).then();
        return;
      }
      this.queryToken = data['token'];
      this.querySub = data['sub'];
    });
  }
  ngOnInit() {
    this.authService.confirmEmail({sub:this.querySub,token:this.queryToken}).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {this.success = true;},
      error: () => {this.success = false;},
    });

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
