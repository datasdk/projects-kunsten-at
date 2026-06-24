import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';

import { CommonModule } from '@angular/common';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'page-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_STANDALONE_IMPORTS,
    CommonModule,
    LoginComponent
  ]
})

export class LoginPage implements OnInit {

  ngOnInit() {}

}
