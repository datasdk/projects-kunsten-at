import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async alert(header: string, message: string, buttons: string[] = ['OK']): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });

    await alert.present();
    await alert.onDidDismiss();
  }

  async confirm(header: string, message: string, confirmText = 'Ja', cancelText = 'Nej'): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: cancelText, role: 'cancel' },
        { text: confirmText, role: 'confirm' }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    return result.role === 'confirm';
  }
}
