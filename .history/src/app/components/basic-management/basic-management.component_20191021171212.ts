import { Storage } from '@ionic/storage';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';

@Component({
  selector: 'app-basic-management',
  templateUrl: './basic-management.component.html',
  styleUrls: ['./basic-management.component.scss']
})
export class BasicManagementComponent implements OnInit {

  DEVICEID = environment.device_id;

  segment = "0";

  companies : any;
  contractors : any;
  sites : any;

  constructor(
    public modalCtrl: ModalController,
    private storage: Storage,
    public getapi: GetApiService,
    private postapi: PostApiService,
    public alertCtrl: AlertController
  ) { 
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCompany(device).subscribe((res) => {
        this.companies = res;
      });
      this.getapi.getContractor(device).subscribe((res) => {
        this.contractors = res;
      });
      this.getapi.getSite(device).subscribe((res) => {
        this.sites = res;
      });
    });
  }

  ngOnInit() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  deleteAlert() {
    let alert = this.alertCtrl.create({
      header: '해당 삭제하시겠습니까?',
      buttons: [{
        text: '취소',
        role: 'cancel',
      },{
          text: '확인',
          role: 'submit',
          handler: (data) => {
          
          }
        }]
    });
    alert.then(alert => alert.present());
  }

  delete(num, id) {
    switch ( num ) {
      case 1:
        this.postapi.deleteCompany(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getCompany(device).subscribe((res) => {
              this.companies = res;
            });
          });
        })
        break;
      case 2:
        this.postapi.deleteContractor(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getContractor(device).subscribe((res) => {
              this.contractors = res;
            });
          });
        })
        break;
      case 3:
        this.postapi.deleteSite(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getSite(device).subscribe((res) => {
              this.sites = res;
            });
          });
        })
        break;
    }
  }


}
