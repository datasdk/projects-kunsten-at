import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ForgotPasswordComponent,
    ...IONIC_STANDALONE_IMPORTS
  ]
})

export class ForgotPasswordPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
