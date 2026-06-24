import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-course-success',
  standalone: true,
  templateUrl: './course-success.page.html',
  styleUrls: ['./course-success.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS, RouterLink]
})
export class CourseSuccessPage {}
