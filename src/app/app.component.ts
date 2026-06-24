import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowBackSharp,
  arrowForwardOutline,
  bookOutline,
  checkmarkCircleOutline,
  chevronBack,
  chevronBackOutline,
  chevronForward,
  chevronForwardOutline,
  close,
  closeOutline,
  documentTextOutline,
  ellipsisVertical,
  helpCircleOutline,
  homeOutline,
  informationCircleOutline,
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
  settingsOutline,
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
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ...IONIC_STANDALONE_IMPORTS
  ],
})
export class AppComponent implements OnInit {
  hideRootMenu = true;
  disableSwipeBack = true;
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
      arrowBackSharp,
      arrowForwardOutline,
      bookOutline,
      checkmarkCircleOutline,
      chevronBack,
      chevronBackOutline,
      chevronForward,
      chevronForwardOutline,
      close,
      closeOutline,
      documentTextOutline,
      ellipsisVertical,
      helpCircleOutline,
      homeOutline,
      informationCircleOutline,
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
      settingsOutline,
      star,
      starOutline,
      statsChartOutline,
      stop,
      timeOutline,
      trendingUpOutline,
      videocamOutline
    });

    this.applyRouteChrome(this.router.url);
  }

  ngOnInit(): void {
    this.applyRouteChrome(this.router.url);

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.applyRouteChrome(event.url);
          return;
        }

        if (event instanceof NavigationEnd) {
          console.info('[app] Navigation finished', event.urlAfterRedirects);
          this.applyRouteChrome(event.urlAfterRedirects);
        }
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
      || path === '/audiobook/player'
      || path === '/pro';
  }

  private isSwipeBackDisabledRoute(url: string): boolean {
    return url.split('?')[0] === '/audiobook/player';
  }

  private applyRouteChrome(url: string): void {
    this.hideRootMenu = this.isShelllessRoute(url);
    this.disableSwipeBack = this.isSwipeBackDisabledRoute(url);
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
