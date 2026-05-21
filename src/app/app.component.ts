import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
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
  timeOutline,
  trendingUpOutline,
  videocamOutline
} from 'ionicons/icons';
import { filter } from 'rxjs';
import { AuthService } from '@/auth/services/auth.service';
import { DeepLinkService } from './core/services/deep-link.service';

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

  constructor(
    public auth: AuthService,
    private router: Router,
    private deepLinks: DeepLinkService,
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
        this.hideRootMenu = this.isShelllessRoute(event.urlAfterRedirects);
      });

    this.deepLinks.initialize();
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
}
