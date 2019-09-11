import { Injectable } from '@angular/core';
import { MenuController, ModalController, NavController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(
      public navCtrl:NavController,
      private toastController: ToastController,
      public alertCtrl: AlertController,

    ) { }
  

  async presentToast(msg) {
    const toast = await this.toastController.create({
        message: msg,
        position: 'bottom',
        duration: 2500
    });
    toast.present();
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      message: msg,
      header: '알림',
      buttons: ['확인']
    });
    alert.then(alert => alert.present());
  }

}
