import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

import { AlertService } from '@services/alert.service';
import { FirebasePushService } from '@/notifications/services/firebase-push.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-settings-notifications-page',
  standalone: true,
  templateUrl: './settings-notifications.page.html',
  styleUrls: ['../../settings-page.shared.scss', './settings-notifications.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class SettingsNotificationsPage implements OnInit {
  loading = false;
  enabled = false;
  readonly isNative = Capacitor.isNativePlatform();

  constructor(
    private push: FirebasePushService,
    private alerts: AlertService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.enabled = await this.push.isSubscribed();
  }

  get statusText(): string {
    return this.enabled
      ? 'Notifikationer er aktiveret'
      : 'Notifikationer er ikke aktiveret';
  }

  async activate(): Promise<void> {
    if (!this.isNative) {
      await this.alerts.alert('Notifikationer', 'Push-notifikationer kan først aktiveres i Android/iOS-buildet.');
      return;
    }

    this.loading = true;
    try {
      const result = await this.push.registerForPush();
      this.enabled = result.success ? true : await this.push.isSubscribed();

      if (!result.success) {
        await this.alerts.alert('Notifikationer', result.msg);
        return;
      }

      await this.alerts.alert('Notifikationer', 'Notifikationer er aktiveret.');
      await this.router.navigateByUrl('/home/settings');
    } finally {
      this.loading = false;
    }
  }
}
