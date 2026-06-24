import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { filter, Subscription } from 'rxjs';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() showMenu = true;
  @Input() menuId = 'main-menu';
  @Input() backHref?: string;
  @Input() backText = 'Tilbage';

  currentUrl = '';
  private subscription?: Subscription;

  constructor(
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get pageTitle(): string {
    if (this.title) {
      return this.title;
    }

    const path = this.currentUrl.split('?')[0];

    if (path.startsWith('/home/results') || path.startsWith('/results')) {
      return 'Resultater';
    }

    if (path.startsWith('/home/audiobook') || path.startsWith('/audiobook')) {
      return 'Lydbøger';
    }

    if (path.startsWith('/home/terms') || path.startsWith('/terms')) {
      return 'Handelsbetingelser';
    }

    if (path.startsWith('/home/help') || path.startsWith('/help')) {
      return 'Sådan bruger du appen..';
    }

    if (path.startsWith('/home/settings') || path.startsWith('/settings')) {
      return this.settingsTitle(path);
    }

    if (path.startsWith('/home')) {
      return 'Vælg øvelse';
    }

    return 'Forside';
  }

  get effectiveBackHref(): string | null {
    if (this.backHref) {
      return this.backHref;
    }

    if (this.isSettingsDetailRoute) {
      return '/home/settings';
    }

    if (this.isSettingsRootRoute) {
      return '/home/dashboard';
    }

    return null;
  }

  get effectiveShowMenu(): boolean {
    return this.showMenu && !this.effectiveBackHref;
  }

  goBack(): void {
    const href = this.effectiveBackHref;

    if (href) {
      void this.navController.navigateBack(href, { animated: false });
    }
  }

  goToDashboard(): void {
    if (!this.currentUrl.startsWith('/home')) {
      return;
    }

    void this.router.navigateByUrl('/home/dashboard');
  }

  private get isSettingsDetailRoute(): boolean {
    const path = this.currentPath();
    return path.startsWith('/home/settings/') || path.startsWith('/settings/');
  }

  private get isSettingsRootRoute(): boolean {
    const path = this.currentPath();
    return path === '/home/settings' || path === '/settings';
  }

  private settingsTitle(path: string): string {
    if (path.endsWith('/profile')) {
      return 'Profil';
    }

    if (path.endsWith('/password')) {
      return 'Skift password';
    }

    if (path.endsWith('/membership')) {
      return 'Mit medlemskab';
    }

    if (path.endsWith('/notifications')) {
      return 'Notifikationer';
    }

    if (path.endsWith('/course') || path.endsWith('/reset-course')) {
      return 'Mit forløb';
    }

    if (path.endsWith('/delete-account') || path.endsWith('/delete-user')) {
      return 'Slet bruger';
    }

    return 'Indstillinger';
  }

  private currentPath(): string {
    return this.currentUrl.split('?')[0];
  }
}
