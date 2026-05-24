import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-course-success',
  standalone: true,
  templateUrl: './course-success.page.html',
  styleUrls: ['./course-success.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink]
})
export class CourseSuccessPage {}
