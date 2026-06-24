import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { FirebasePushService } from '@/notifications/services/firebase-push.service';
import { AlertService } from '@services/alert.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-notification-register',
  standalone: true,
  templateUrl: './notification-register.component.html',
  styleUrls: ['./notification-register.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class NotificationRegisterComponent implements OnInit {
  @Output() registered = new EventEmitter<void>();

  loading = false;
  subscribed = false;
  message: string | null = null;
  readonly isNative = Capacitor.isNativePlatform();

  constructor(
    private push: FirebasePushService,
    private alerts: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    this.subscribed = await this.push.isSubscribed();
  }

  get statusText(): string {
    return this.subscribed
      ? 'Notifikationer er aktiveret'
      : 'Notifikationer er ikke aktiveret';
  }

  async register(): Promise<void> {
    if (!this.isNative) {
      await this.alerts.alert('Notifikationer', 'Push-notifikationer kan først registreres i Android/iOS-buildet.');
      return;
    }

    this.loading = true;
    this.message = null;

    try {
      const result = await this.push.registerForPush();
      this.subscribed = result.success ? true : await this.push.isSubscribed();
      this.message = result.msg;

      if (!result.success) {
        await this.alerts.alert('Notifikationer', result.msg);
        return;
      }

      this.registered.emit();
    } finally {
      this.loading = false;
    }
  }
}
