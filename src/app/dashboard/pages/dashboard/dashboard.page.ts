import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, IonContent, IonicModule } from '@ionic/angular';
import { AuthService } from '@/auth/services/auth.service';
import { BoxBreathingComponent } from '../../components/box-breathing/box-breathing.component';
import { MyCourseCardComponent } from '../../components/my-course-card.component';
import { CourseSnapshot } from '@/course/interfaces/course-snapshot.interface';
import { CourseProgressService } from '@/course/services/course-progress.service';
import { CourseWheelComponent } from '../../components/course-wheel/course-wheel.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule, CourseWheelComponent, BoxBreathingComponent, MyCourseCardComponent]
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;
  @ViewChild(CourseWheelComponent) wheel?: CourseWheelComponent;

  course: CourseSnapshot | null = null;
  showDashboardProNotice = false;
  private routerSubscription?: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    private progress: CourseProgressService,
    private alertController: AlertController
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

  closeDashboardProNotice(): void {
    localStorage.setItem('dashboard_pro_notice_closed', '1');
    this.showDashboardProNotice = false;
  }

  private async refreshState(): Promise<void> {
    if (!(await this.auth.hasAppAccess())) {
      await this.router.navigateByUrl('/welcome');
      return;
    }

    const loggedIn = await this.auth.isLoggedin();

    if (loggedIn) {
      await this.auth.getUser();
      this.course = await this.progress.getStart();
      this.showDashboardProNotice = !this.auth.hasPlan(1)
        && localStorage.getItem('dashboard_pro_notice_closed') !== '1';
      await this.showLoginWelcomeOnce();
      return;
    }

    this.course = null;
    this.showDashboardProNotice = false;
  }

  private async showLoginWelcomeOnce(): Promise<void> {
    if (localStorage.getItem('show_dashboard_welcome') !== '1') {
      return;
    }

    localStorage.removeItem('show_dashboard_welcome');

    const alert = await this.alertController.create({
      header: 'Velkommen',
      message: 'Velkommen til Kunsten at tæmme en tiger. Her får du adgang til videokurser, daglige øvelser, lydbøger og vejrtrækningsøvelser, der kan hjælpe dig med at skabe mere ro i sindet.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
