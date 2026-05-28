import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() showMenu = true;
  @Input() menuId = 'main-menu';
  @Input() backHref?: string;
  @Input() backText = 'Tilbage';

  currentUrl = '';
  private subscription?: Subscription;

  constructor(private router: Router) {}

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
      return 'Betingelser';
    }

    if (path.startsWith('/home')) {
      return 'Kunsten at tæmme en tiger';
    }

    return 'Kunsten at tæmme en tiger';
  }
}
