import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from "primeng/button";

@Component({
  selector: 'app-about',
    imports: [
        Card,
        Button
    ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
