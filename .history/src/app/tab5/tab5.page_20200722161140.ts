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
import { TranslateConfigService, StorageService, BluetoothService } from '../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

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

  realtime: string = '0';
  private interval = null;

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
    private translate: TranslateService,
    private bluetooth: BluetoothService,
    private document: DocumentViewer

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
      if (!lang) {
        const localLang = this.translate.getBrowserLang();
        if(localLang != 'ko') {
          this.languageSelected = 'en';
        } else {
        this.languageSelected = this.translate.getBrowserLang();
        }
      } else {
        this.languageSelected = lang;
      }
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

  ngAfterViewInit() {
    this.interval = setInterval(() => {      
      this.requestData();
    }, 1*1000);
  }

  ionViewWillLeave(){
    clearInterval(this.interval); 
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
          this.support.presentToast(this.translate.instant("TAB5.CHANGED"));
          this.getCommon();
          this.isEditItems = true;
        }
      );
    }); 
  }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant("TAB5.PASS.TITLE"),
      inputs: [
        {
          type: 'password',
          name: 'oldpass',
          placeholder: this.translate.instant("TAB5.PASS.OLD")
        },
        {
          type: 'password',
          name: 'newpass',
          placeholder: this.translate.instant("TAB5.PASS.NEW")
        },
        {
          type: 'password',
          name: 'newpasschk',
          placeholder: this.translate.instant("TAB5.PASS.RE")
        }
      ],
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('CONFIRM'),
          role: 'submit',
          handler: data => {
            
            if(data.newpass == "" || data.oldpass == "" || data.newpasschk == "") {
              this.support.presentToast(this.translate.instant('INPUTALL'));
              return false;
            }
            if(data.newpass != data.newpasschk) {
              this.support.presentToast(this.translate.instant('INCORRECT'));
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
    this.storageService.setLang(this.languageSelected);
  }

  apply(evt) {
    const id = evt.target.id;
    if(id == 'mass') {
      this.commonForm.controls['mass'].patchValue(this.realtime);
    } else if(id == 'water') {
      this.commonForm.controls['water'].patchValue(this.realtime);
    }
  }

  requestData() {
    let data = new Uint8Array(3);
    data[0] = 0x02;
    data[1] = 0x20;
    data[2] = 0x03;
    this.bluetooth.dataInOutRealtime(data).then((res) => {
      this.realtime = res.replace(/[^0-9]/g,'');
    });
  }

  openPdf() {
    const options: DocumentViewerOptions = {
      title: 'manual PDF'
    }
    
    this.document.viewDocument('file:///assets/manual.pdf', 'application/pdf', options)
  }

}
