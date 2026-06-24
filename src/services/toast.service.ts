import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async success(message: string): Promise<void> {
    await this.present(message, 'app-toast app-toast-success');
  }

  async danger(message: string): Promise<void> {
    await this.present(message, 'app-toast app-toast-danger');
  }

  private async present(message: string, cssClass: string): Promise<void> {
    try {
      const toast = await this.toastController.create({
        message,
        duration: 3200,
        position: 'top',
        cssClass
      });

      await toast.present();
    } catch (error) {
      console.error('[toast] Could not present toast overlay', error);
    }
  }
}
