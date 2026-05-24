import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CourseSnapshot } from '@/course/services/course-progress.service';

@Component({
  selector: 'app-my-course-card',
  standalone: true,
  templateUrl: './my-course-card.component.html',
  styleUrls: ['./my-course-card.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class MyCourseCardComponent {
  @Input() course: CourseSnapshot | null = null;
  @Output() removeCourseRequested = new EventEmitter<void>();

  menuOpen = false;

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

  removeCourse(): void {
    this.removeCourseRequested.emit();
    this.menuOpen = false;
  }
}
