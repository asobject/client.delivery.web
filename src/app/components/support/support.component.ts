import {Component, OnDestroy} from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {InputGroup} from 'primeng/inputgroup';
import {ChatService} from '../../_services/support/chat.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-support',
  imports: [
    Card,
    Button,
    InputText,
    InputGroup,
    FormsModule,
    Tag
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  responses:string[]=[];
  requests:string[]=[];
  prompt!:string;
  loadingSending:boolean = false;
  constructor(private chatService:ChatService) {}
  sendMessage(){
    this.loadingSending = true;
    this.chatService.sendMessage({prompt:this.prompt}).pipe(takeUntil(this.destroy$),finalize(()=>this.loadingSending=false)).subscribe(
      {
        next:(response)=>{
          this.requests.push(this.prompt);
          this.prompt="";
          this.responses.push(response);},
        error:()=>{}
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
