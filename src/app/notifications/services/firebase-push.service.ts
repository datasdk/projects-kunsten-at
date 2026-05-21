import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token
} from '@capacitor/push-notifications';
import { ApiService } from '@/core/services/api.service';
import { NativeStorageService } from '@/core/services/native-storage.service';

interface DeviceRegistrationPayload {
  token: string;
  device_id: string;
  device_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebasePushService {
  private listenersReady = false;

  constructor(
    private api: ApiService,
    private storage: NativeStorageService
  ) {}

  async initialize(): Promise<void> {
    if (this.listenersReady) {
      return;
    }

    this.listenersReady = true;

    PushNotifications.addListener('registration', async (token: Token) => {
      await this.registerDevice(token.value);
      await this.storage.setString('subscribedToNotifications', 'true');
    });

    PushNotifications.addListener('registrationError', (error: unknown) => {
      console.error('Push registration error', error);
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title: notification.title ?? 'Kunsten At',
            body: notification.body ?? '',
            schedule: { at: new Date(Date.now() + 100) }
          }
        ]
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.info('Push action performed', notification);
    });
  }

  async registerForPush(): Promise<{ success: boolean; msg: string }> {
    await this.initialize();

    if (!Capacitor.isNativePlatform()) {
      return { success: false, msg: 'Push-notifikationer kræver en native app-build.' };
    }

    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      return { success: false, msg: 'Tilladelse til push-notifikationer blev ikke givet.' };
    }

    await LocalNotifications.requestPermissions();
    await PushNotifications.register();

    return { success: true, msg: 'Registrering startet.' };
  }

  async isSubscribed(): Promise<boolean> {
    return (await this.storage.getString('subscribedToNotifications')) === 'true';
  }

  private async registerDevice(token: string): Promise<void> {
    const payload = await this.devicePayload(token);
    await this.api.post('firebase/devices', payload);
  }

  private async devicePayload(token: string): Promise<DeviceRegistrationPayload> {
    if (!Capacitor.isNativePlatform()) {
      return {
        token,
        device_id: 'web',
        device_type: 'web'
      };
    }

    const [info, id] = await Promise.all([
      Device.getInfo(),
      Device.getId().catch(() => ({ identifier: 'unknown' }))
    ]);

    return {
      token,
      device_id: id.identifier,
      device_type: info.platform
    };
  }
}
