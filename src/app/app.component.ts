import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  bookOutline,
  checkmarkCircleOutline,
  closeOutline,
  ellipsisVertical,
  homeOutline,
  logInOutline,
  logOutOutline,
  menuOutline,
  musicalNotesOutline,
  pause,
  pauseCircleOutline,
  play,
  playCircleOutline,
  playSkipBackCircleOutline,
  playSkipForwardCircleOutline,
  refreshOutline,
  star,
  starOutline,
  statsChartOutline,
  stop,
  timeOutline,
  trendingUpOutline,
  videocamOutline
} from 'ionicons/icons';
import { filter, first } from 'rxjs';
import { AuthService } from '@/auth/services/auth.service';
import { FirebasePushService } from '@/notifications/services/firebase-push.service';
import { DeepLinkService } from '@services/deep-link.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonicModule
  ],
})
export class AppComponent implements OnInit {
  hideRootMenu = false;
  loggingOut = false;
  private splashHidden = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private deepLinks: DeepLinkService,
    private push: FirebasePushService,
    private menu: MenuController
  ) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      bookOutline,
      checkmarkCircleOutline,
      closeOutline,
      ellipsisVertical,
      homeOutline,
      logInOutline,
      logOutOutline,
      menuOutline,
      musicalNotesOutline,
      pause,
      pauseCircleOutline,
      play,
      playCircleOutline,
      playSkipBackCircleOutline,
      playSkipForwardCircleOutline,
      refreshOutline,
      star,
      starOutline,
      statsChartOutline,
      stop,
      timeOutline,
      trendingUpOutline,
      videocamOutline
    });
  }

  ngOnInit(): void {
    this.hideRootMenu = this.isShelllessRoute(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.info('[app] Navigation finished', event.urlAfterRedirects);
        this.hideRootMenu = this.isShelllessRoute(event.urlAfterRedirects);
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        first()
      )
      .subscribe(() => {
        void this.hideSplashWhenAppIsReady();
      });

    try {
      this.deepLinks.initialize();
    } catch (error) {
      console.warn('[app] Deep link initialization failed', error);
    }

    void this.push.initialize().catch((error) => {
      console.warn('[app] Push initialization failed', error);
    });

    window.setTimeout(() => {
      if (!this.splashHidden) {
        console.warn('[app] Splash is still visible while waiting for rendered app content.');
        void this.hideSplashWhenAppIsReady();
      }
    }, 12000);
  }

  async logout(): Promise<void> {
    this.loggingOut = true;

    try {
      await this.auth.logout();
      await this.menu.close('main-menu');
      await this.router.navigateByUrl('/welcome');
    } finally {
      this.loggingOut = false;
    }
  }

  async closeMenu(): Promise<void> {
    await this.menu.close('main-menu');
  }

  private isShelllessRoute(url: string): boolean {
    const path = url.split('?')[0];
    return path.startsWith('/auth')
      || path.startsWith('/welcome')
      || path.startsWith('/videos')
      || path.startsWith('/audiobook/player')
      || path.startsWith('/course/start');
  }

  private async hideSplashWhenAppIsReady(): Promise<void> {
    if (this.splashHidden || !Capacitor.isNativePlatform()) {
      return;
    }

    const rendered = await this.waitForRenderedRoute();

    if (!rendered) {
      console.warn('[app] Route content was not rendered yet; keeping splash screen visible.');
      return;
    }

    try {
      await SplashScreen.hide({ fadeOutDuration: 250 });
      this.splashHidden = true;
      console.info('[app] Splash screen hidden after app content rendered.');
    } catch (error) {
      console.warn('[app] Could not hide splash screen', error);
    }
  }

  private async waitForRenderedRoute(): Promise<boolean> {
    for (let attempts = 0; attempts < 80; attempts += 1) {
      await this.nextFrame();

      if (this.hasRenderedRouteContent()) {
        return true;
      }
    }

    return false;
  }

  private hasRenderedRouteContent(): boolean {
    const outlet = document.querySelector('ion-router-outlet');

    if (!outlet?.children.length) {
      return false;
    }

    return Array.from(outlet.children).some((child) => {
      const element = child as HTMLElement;
      const text = element.innerText?.trim() ?? '';

      return text.length > 0 || !!element.querySelector('ion-content, section, img, canvas, form');
    });
  }

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  }
}
