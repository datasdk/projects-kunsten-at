import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CourseSnapshot } from '@/course/interfaces/course-snapshot.interface';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-my-course-card',
  standalone: true,
  templateUrl: './my-course-card.component.html',
  styleUrls: ['./my-course-card.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class MyCourseCardComponent {
  @Input() course: CourseSnapshot | null = null;

  constructor(
    private router: Router
  ) {}

  continueCourse(): void {
    if (!this.course?.category_id) {
      return;
    }

    this.router.navigate(['/videos'], {
      queryParams: {
        category_id: this.course.category_id,
        index: this.course.index ?? 0
      }
    });
  }
}
