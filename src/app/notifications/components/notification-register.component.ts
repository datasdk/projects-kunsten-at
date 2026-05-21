import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { FirebasePushService } from '@/notifications/services/firebase-push.service';
import { AlertService } from '@/core/services/alert.service';

@Component({
  selector: 'app-notification-register',
  standalone: true,
  templateUrl: './notification-register.component.html',
  styleUrls: ['./notification-register.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class NotificationRegisterComponent implements OnInit {
  loading = false;
  subscribed = false;
  readonly isNative = Capacitor.isNativePlatform();

  constructor(
    private push: FirebasePushService,
    private alerts: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    this.subscribed = await this.push.isSubscribed();
  }

  async register(): Promise<void> {
    this.loading = true;

    try {
      const result = await this.push.registerForPush();
      this.subscribed = result.success || this.subscribed;

      if (!result.success) {
        await this.alerts.alert('Notifikationer', result.msg);
      }
    } finally {
      this.loading = false;
    }
  }
}
