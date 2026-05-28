import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertService } from '@services/alert.service';
import { CourseQuestion } from '@/course/interfaces/course-question.interface';
import { CourseProgressService } from '@/course/services/course-progress.service';

@Component({
  selector: 'app-course-stop',
  standalone: true,
  templateUrl: './course-stop.page.html',
  styleUrls: ['./course-stop.page.scss'],
  imports: [CommonModule, IonicModule]
})
export class CourseStopPage {
  readonly ratingValues = [1, 2, 3, 4, 5];
  questions: CourseQuestion[];
  loading = false;
  categoryId: string | null;
  days: string | null;

  constructor(
    private progress: CourseProgressService,
    private alerts: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.questions = this.progress.freshQuestions();
    this.categoryId = this.route.snapshot.queryParamMap.get('category_id');
    this.days = this.route.snapshot.queryParamMap.get('days');
  }

  setRating(question: CourseQuestion, value: number): void {
    question.value = value;
  }

  async submit(): Promise<void> {
    if (this.questions.some((question) => question.value <= 0)) {
      await this.alerts.alert('Afslutningstest', 'Du skal vælge antal stjerner for alle spørgsmål.');
      return;
    }

    this.loading = true;

    await this.progress.setStop({
      category_id: this.categoryId,
      title: 'Min tilstand (efter)',
      days: this.days,
      statistics: {
        items: this.questions,
        category: 'evolution_end'
      }
    });

    this.loading = false;
    this.router.navigate(['/home/results']);
  }
}
