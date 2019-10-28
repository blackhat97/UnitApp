import { Storage } from '@ionic/storage';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { SupportService } from 'src/app/providers/services/support.service';

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

  input1: string;
  input2: string;
  input3: string;

  constructor(
    public modalCtrl: ModalController,
    private storage: Storage,
    public getapi: GetApiService,
    private postapi: PostApiService,
    public alertCtrl: AlertController,
    public support:SupportService
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

  deleteAlert(num, id) {
    let alert = this.alertCtrl.create({
      message: '해당명을 삭제 하시겠습니까?',
      buttons: [{
        text: '취소',
        role: 'cancel',
      },{
          text: '확인',
          role: 'submit',
          handler: (data) => {
            this.delete(num, id);
          }
        }]
    });
    alert.then(alert => alert.present());
  }

  addCompany() {
    this.storage.get(this.DEVICEID).then(device => {
      this.postapi.addCompany(device, this.input1).subscribe((res) => {
        this.input1 = "";
        this.support.presentToast('사업장을 추가했습니다.');  
      });
    });
  }

  addContractor() {
    this.storage.get(this.DEVICEID).then(device => {
      this.postapi.addContractor(device, this.input2).subscribe((res) => {
        this.support.presentToast('계약자를 추가했습니다.');
        this.input2 = "";
      });
    });
  }

  addSite() {
    this.storage.get(this.DEVICEID).then(device => {
      this.postapi.addContractor(device, this.input3).subscribe((res) => {
        this.support.presentToast('현장명을 추가했습니다.');
        this.input3 = "";
      });
    });
  }

  delete(num, id) {
    switch ( num ) {
      case 1:
        this.postapi.deleteCompany(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getCompany(device).subscribe((res) => {
              this.companies = res;
              this.support.presentToast('삭제하였습니다.');
            });
          });
        })
        break;
      case 2:
        this.postapi.deleteContractor(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getContractor(device).subscribe((res) => {
              this.contractors = res;
              this.support.presentToast('삭제하였습니다.');
            });
          });
        })
        break;
      case 3:
        this.postapi.deleteSite(id).subscribe((res) => {
          this.storage.get(this.DEVICEID).then(device => {
            this.getapi.getSite(device).subscribe((res) => {
              this.sites = res;
              this.support.presentToast('삭제하였습니다.');
            });
          });
        })
        break;
    }
  }


}
