import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CourseSnapshot } from '@/course/interfaces/course-snapshot.interface';
import { CourseProgressService } from '@/course/services/course-progress.service';
import { AlertService } from '@services/alert.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-settings-course-page',
  standalone: true,
  templateUrl: './settings-course.page.html',
  styleUrls: ['../../settings-page.shared.scss', './settings-course.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class SettingsCoursePage implements OnInit {
  course: CourseSnapshot | null = null;
  loading = false;

  constructor(
    private progress: CourseProgressService,
    private alerts: AlertService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.course = await this.progress.getStart();
  }

  async reset(): Promise<void> {
    if (!this.course) {
      return;
    }

    const confirmed = await this.alerts.confirm(
      'Mit forløb',
      'Dette nulstiller dit seneste aktive forløb i appen.',
      'Nulstil',
      'Annuller'
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    try {
      await this.progress.clearCurrentCourse();
      this.course = null;
      await this.alerts.alert('Mit forløb', 'Dit seneste forløb er nulstillet.');
      await this.router.navigateByUrl('/home/settings');
    } finally {
      this.loading = false;
    }
  }
}
