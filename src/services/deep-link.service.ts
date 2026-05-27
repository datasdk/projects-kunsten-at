import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {
  private initialized = false;

  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    void App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.routeFromUrl(event.url);
    }).catch((error) => {
      console.warn('[app] Could not register deep link listener', error);
    });

    void App.getLaunchUrl().then((launch) => {
      if (launch?.url) {
        this.routeFromUrl(launch.url);
      }
    }).catch((error) => {
      console.warn('[app] Could not read launch URL', error);
    });
  }

  private routeFromUrl(rawUrl: string): void {
    const route = this.mapUrlToRoute(rawUrl);

    if (!route) {
      return;
    }

    this.zone.run(() => {
      this.router.navigateByUrl(route).catch(() => undefined);
    });
  }

  private mapUrlToRoute(rawUrl: string): string | null {
    try {
      const url = new URL(rawUrl);
      const path = url.protocol === 'kunstenat:' ? `/${url.host}${url.pathname}` : url.pathname;
      const query = url.search;

      if (path.startsWith('/podcast/playlist') || path.startsWith('/audiobook/player')) {
        return `/audiobook/player${query}`;
      }

      if (path.startsWith('/podcast') || path.startsWith('/audiobook') || path.startsWith('/media/audio')) {
        return `/audiobook${query}`;
      }

      if (path.startsWith('/videos')) {
        return `/videos${query}`;
      }

      if (path.startsWith('/course/')) {
        return `${path}${query}`;
      }

      if (path.startsWith('/results')) {
        return `/results${query}`;
      }

      if (path.startsWith('/terms')) {
        return `/terms${query}`;
      }

      return `/home${query}`;
    } catch {
      return null;
    }
  }
}
