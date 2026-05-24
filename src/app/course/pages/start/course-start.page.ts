import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@/auth/services/auth.service';
import { AlertService } from '@services/alert.service';
import { ApiService } from '@services/api.service';
import { CourseProgressService, CourseQuestion } from '@/course/services/course-progress.service';
import { NotificationRegisterComponent } from '@/notifications/components/notification-register.component';

@Component({
  selector: 'app-course-start',
  standalone: true,
  templateUrl: './course-start.page.html',
  styleUrls: ['./course-start.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, NotificationRegisterComponent]
})
export class CourseStartPage {
  step = 0;
  readonly maxStep = 4;
  readonly daysOptions = [7, 14, 21];
  readonly ratingValues = [1, 2, 3, 4, 5];
  days = 7;
  loading = false;
  questions: CourseQuestion[];
  categoryId: string | null;
  index: string | null;

  constructor(
    private progress: CourseProgressService,
    private alerts: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService
  ) {
    this.questions = this.progress.freshQuestions();
    this.categoryId = this.route.snapshot.queryParamMap.get('category_id');
    this.index = this.route.snapshot.queryParamMap.get('index') ?? '0';
  }

  get courseName(): string {
    const names: Record<string, string> = {
      '1': 'Meditation',
      '2': 'Udstrækning',
      '3': 'Perfekt morgen',
      '4': 'Vejrtrækning'
    };

    return names[String(this.categoryId ?? '')] ?? 'dit valgte forløb';
  }

  async next(): Promise<void> {
    if (this.step === 1 && this.questions.some((question) => question.value <= 0)) {
      await this.alerts.alert('Tilstands-test', 'Du skal vælge antal stjerner for alle spørgsmål.');
      return;
    }

    if (this.step < this.maxStep) {
      this.step += 1;
      return;
    }

    await this.submit();
  }

  back(): void {
    if (this.step === 0) {
      this.close();
      return;
    }

    this.step = Math.max(0, this.step - 1);
  }

  close(): void {
    this.router.navigate(['/videos'], {
      queryParams: {
        category_id: this.categoryId,
        index: this.index
      }
    });
  }

  async submit(): Promise<void> {
    this.loading = true;

    try {
      await this.progress.setStart({
        index: this.index,
        category_id: this.categoryId,
        title: 'Min tilstand før',
        days: this.days,
        statistics: {
          items: this.questions,
          category: 'evolution_start'
        }
      });

      await this.createNotifications();

      this.router.navigate(['/videos'], {
        queryParams: {
          category_id: this.categoryId,
          index: this.index
        }
      });
    } finally {
      this.loading = false;
    }
  }

  setRating(question: CourseQuestion, value: number): void {
    question.value = value;
  }

  private async createNotifications(): Promise<void> {
    const user = await this.auth.getUser();
    const notifications = [];

    for (let day = 1; day < this.days; day += 1) {
      notifications.push({
        user_id: user?.id,
        draft_id: 1,
        url: `kunstenat://videos?category_id=${this.categoryId}&index=${this.index}`,
        send_after: this.sendingDate(day)
      });
    }

    await this.progress.setActiveTask(this.categoryId, this.index, {
      days: this.days,
      startdate: this.sendingDate(0)
    });

    await this.api.post('firebase/notifications', {
      recipients: 'player_id',
      notifications
    });
  }

  private sendingDate(dayOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(8, 0, 0, 0);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
  }
}
