import { LanguageModel } from './../providers/models/language.model';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../providers/services/authentication.service';
import { GetApiService } from '../providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PostApiService } from '../providers/services/post-api.service';
import { SupportService } from '../providers/services/support.service';
import { AlertController, ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { TranslateConfigService, StorageService } from '../providers/providers';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  commonForm: FormGroup;

  profiles : any;
  device : string;
  commons : any;

  USERID = environment.user_id;
  DEVICEID = environment.device_id;
  LOCKER = environment.locker;

  isEditItems: boolean = true;

  showCommon: boolean = false;

  versionNumber:string;
  languageSelected : string = '';
  languages : Array<LanguageModel>;

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    private storageService: StorageService,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private postapi: PostApiService,
    public support:SupportService,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    private appVersion: AppVersion,
    public navCtrl: NavController,
    public translateConfig: TranslateConfigService,
  ) {

    this.languages = this.translateConfig.getLanguages();

    this.getProfile();
    this.getCommon();
    this.setLanguage();

    this.appVersion.getVersionNumber().then(value => {
      this.versionNumber = `v${value}`;
    }).catch(err => {
      console.log(err);
    });

  }

  ionViewDidEnter(){
    this.storageService.getLang().then(lang => {
      console.log(lang);
      this.languageSelected = lang;
    });
  }

  ngOnInit() {
    this.storage.ready().then(() => {
      this.storage.get(this.DEVICEID).then(device => {
        this.device = device;
        this.getapi.getCommon(device).subscribe((res) => {
          this.commonForm = this.formBuilder.group({
            mass: new FormControl(res[0].mass, Validators.required),
            water: new FormControl(res[0].water, Validators.required),
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

  moveLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  setLanguage() {
    this.translateConfig.setLanguage(this.languageSelected);
  }

}
