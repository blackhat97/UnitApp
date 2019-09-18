import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../providers/services/authentication.service';
import { GetApiService } from '../providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PostApiService } from '../providers/services/post-api.service';
import { SupportService } from '../providers/services/support.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  commonForm: FormGroup;

  segment = "0";
  profiles : any;
  commons : any;

  USERID = environment.user_id;
  DEVICEID = environment.device_id;
  LOCKER = environment.locker;

  isEditItems: boolean = true;

  showCommon: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private postapi: PostApiService,
    public support:SupportService
  ) { 
    this.getProfile();
    this.getCommon();
  }

  ngOnInit() {
    this.storage.ready().then(() => {
      this.storage.get(this.DEVICEID).then(device => {
        this.getapi.getCommon(device).subscribe((res) => {
          this.commonForm = this.formBuilder.group({
            mass: new FormControl(res[0].mass, Validators.required),
            water: new FormControl(res[0].water, Validators.required),
            volume: new FormControl(res[0].volume, Validators.required)      
          });
        });
      });
    });

  }

  getProfile() {
    this.storage.get(this.USERID).then(username => {
      this.getapi.getProfile(username).subscribe((res) => {
        this.profiles = res;
      });
    });
  }

  getCommon() {
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCommon(device).subscribe((res) => {
        this.commons = res;
      });
    });
  }

  onEditCloseItems() {
    this.isEditItems = !this.isEditItems;
  }


  onSubmit(data) {
    this.storage.get(this.DEVICEID).then(deviceId => {
      this.postapi.updateCommon(deviceId, data)
      .subscribe(
        res => {
          this.support.presentToast('변경되었습니다');
          this.getCommon();
          this.isEditItems = true;
        }
      );
    }); 
  }

  verifyPass() {
    let alert = this.alertCtrl.create({
      header: '암호 입력',
      inputs: [
        {
          type: 'password',
          name: 'pass',
          placeholder: '비밀번호'
        },
      ],
      buttons: [{
        text: '취소',
        role: 'cancel',
      },{
          text: '확인',
          role: 'submit',
          handler: (data) => {
            
            if(data.pass != this.LOCKER) {
              this.support.showAlert('암호가 일치하지 않습니다.');
            } else {
              this.showCommon = true;
            }
          
          }
        }]
    });
    alert.then(alert => alert.present());
  }

  async commonValue() {
    const alert = await this.alertCtrl.create({
      header: '비밀번호 변경',
      inputs: [
        {
          type: 'text',
          name: '공기실용적',
          placeholder: "입력"
        },
        {
          type: 'text',
          name: 'Pz',
          placeholder: "입력"
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: data => {
            console.log(data);
          }
        }
      ],
    });
    await alert.present();
  }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: '비밀번호 변경',
      inputs: [
        {
          type: 'password',
          name: 'oldpass',
          placeholder: '현재 비밀번호'
        },
        {
          type: 'password',
          name: 'newpass',
          placeholder: '새로운 비밀번호'
        },
        {
          type: 'password',
          name: 'newpasschk',
          placeholder: '비밀번호 재입력'
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: data => {
            
            if(data.newpass == "" || data.oldpass == "" || data.newpasschk == "") {
              this.support.presentToast("모두입력 바랍니다.");
              return false;
            }
            if(data.newpass != data.newpasschk) {
              this.support.presentToast("새로운 비밀번호가 일치하지 않습니다.");
              return false;
            } else {
              let value = { "oldpass": data.oldpass, "newpass": data.newpass };
              
              this.storage.get(this.USERID).then(id => {
                this.authService.updatePass(id, value).subscribe( (res: any) => {  
                  this.support.presentToast(res.message);
                  
                });
              });
            }
            
          }
        }
      ],
    });
    await alert.present();
  }


  onLoggedout() {
    this.authService.logout();
  }



}
