import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '@/auth/services/auth.service';
import { BoxBreathingComponent } from '../../components/box-breathing/box-breathing.component';
import { MyCourseCardComponent } from '../../components/my-course-card.component';
import { CourseSnapshot } from '@/course/interfaces/course-snapshot.interface';
import { CourseProgressService } from '@/course/services/course-progress.service';
import { CourseWheelComponent } from '../../components/course-wheel/course-wheel.component';
import { filter, Subscription } from 'rxjs';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, RouterLink, ...IONIC_STANDALONE_IMPORTS, CourseWheelComponent, BoxBreathingComponent, MyCourseCardComponent]
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;
  @ViewChild(CourseWheelComponent) wheel?: CourseWheelComponent;

  course: CourseSnapshot | null = null;
  loggedIn = false;
  isPro = false;
  private routerSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    private progress: CourseProgressService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.refreshState();
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects.split('?')[0].startsWith('/home')) {
          window.setTimeout(() => {
            this.wheel?.reset();
            void this.content?.scrollToTop(0);
          }, 0);
        }
      });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.refreshState();
    this.wheel?.reset();
    await this.content?.scrollToTop(0);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  async removeCourse(): Promise<void> {
    await this.progress.clearCurrentCourse();
    this.course = null;
  }

  private async refreshState(): Promise<void> {
    if (!(await this.auth.hasAppAccess())) {
      await this.router.navigateByUrl('/welcome');
      return;
    }

    this.loggedIn = await this.auth.isLoggedin();

    if (this.loggedIn) {
      await this.auth.getUser();
      this.course = await this.progress.getStart();
      this.isPro = this.auth.hasPlan(1);
      return;
    }

    this.course = null;
    this.isPro = false;
  }
}
