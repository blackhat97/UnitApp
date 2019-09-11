import { Injectable } from '@angular/core';
import { MenuController, ModalController, NavController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

    _favorites: string[] = [];

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

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    console.log(sessionName);
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }



}
