import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '@services/alert.service';
import { AuthService } from '@/auth/services/auth.service';
import { CourseProgressService } from '@/course/services/course-progress.service';
import { VideoItem } from '../../interfaces/video-item.interface';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-video-task-action',
  standalone: true,
  templateUrl: './video-task-action.component.html',
  styleUrls: ['./video-task-action.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class VideoTaskActionComponent implements OnChanges {
  @Input({ required: true }) video!: VideoItem;
  @Input({ required: true }) index = 0;
  @Input() categoryId: string | number | null = null;

  checked = false;
  activeTask = false;
  hasActiveTask = false;

  constructor(
    private progress: CourseProgressService,
    private router: Router,
    private alerts: AlertService,
    private auth: AuthService
  ) {}

  async ngOnChanges(): Promise<void> {
    await this.refreshState();
  }

  get isIntro(): boolean {
    return this.video.tags?.includes('intro') ?? false;
  }

  async setChecked(checked: boolean): Promise<void> {
    const task = await this.progress.getActiveTask(this.categoryId, this.index);

    if (checked && task && this.progress.isTaskPeriodComplete(task)) {
      await this.progress.setTaskDone(this.categoryId, this.index, true);
      await this.alerts.alert(
        'Tillykke!',
        'Du er færdig med dit forløb. Udfyld afslutningstesten for at se din udvikling.'
      );
      this.router.navigate(['/course/stop'], {
        queryParams: {
          category_id: this.categoryId,
          days: task.days
        }
      });
      return;
    }

    await this.progress.setTaskDone(this.categoryId, this.index, checked);
    await this.refreshState();
  }

  get canStartCourse(): boolean {
    return !!this.auth.token() && !this.activeTask && !this.hasActiveTask;
  }

  async startCourse(): Promise<void> {
    if (!(await this.auth.isLoggedin())) {
      const destination = `/videos?category_id=${this.categoryId ?? ''}&index=${this.index}`;
      await this.auth.setLoginRedirect(destination);
      await this.alerts.alert('Log ind kræves', 'Du er ikke logget ind. Derfor er kun én video tilgængelig. Log ind for at få fuld adgang.', ['Log ind']);
      await this.router.navigateByUrl('/auth/login');
      return;
    }

    await this.router.navigate(['/course/start'], {
      queryParams: {
        category_id: this.categoryId,
        index: this.index
      }
    });
  }

  private async refreshState(): Promise<void> {
    this.activeTask = (await this.progress.getActiveTask(this.categoryId, this.index)) !== null;
    this.hasActiveTask = await this.progress.hasAnyActiveTask();
    this.checked = await this.progress.isTaskDoneToday(this.categoryId, this.index);
  }
}
