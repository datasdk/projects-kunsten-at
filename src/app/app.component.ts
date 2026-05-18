import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [    
    IonApp, 
    IonRouterOutlet,
    RouterModule,
    CommonModule
  ],
})
export class AppComponent {
  constructor() {}
}
