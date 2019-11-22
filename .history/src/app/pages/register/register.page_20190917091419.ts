import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { FormDataService } from 'src/app/providers/services/formData.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  constructor(
    private location: Location,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController,
    private formDataService: FormDataService

  ) { }

  ngOnInit() {

  }

  goBack() {
    //this.location.back();
    this.showAlert('배합등록을 종료하시겠습니까?');
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: '알림',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          handler: () => {
            //this.router.navigate(['/mix-list']);
            this.formDataService.resetFormData();
            //this.location.back();
            this.navCtrl.navigateBack('/tabs/tab1');
          }
        }
      ]
    });
    alert.then(alert => alert.present());
  }


}
