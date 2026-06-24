import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from '../../components/register/register.component';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...IONIC_STANDALONE_IMPORTS,
    RegisterComponent
  ]
})
export class RegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
