import { environment } from 'src/environments/environment.prod';
import { ModalController, Platform, AlertController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/File/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { SupportService } from 'src/app/providers/services/support.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  DEVICEID = environment.device_id;

  values = {
    common_mass: '',
    common_water: '',
    common_volume: '',
    input_slump: '',
    input_temp: '',
    input_concrete: '',
    input_water: '',
    input_i_pressure: '',
    input_e_pressure: '',
    mix_volume: '',
    mass : '',
    air : '',
    quantity : '',
  };
  mixs = {};
  inputs = {};
  mixId: string = '';

  constructor(
    public modalCtrl: ModalController,
    private platform: Platform, 
    private file: File, 
    private ft: FileTransfer, 
    private fileOpener: FileOpener, 
    private document: DocumentViewer,
    public postapi: PostApiService,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public formula: FormulaService,
    public getapi: GetApiService,
    private storage: Storage,
    public support:SupportService
  ) {
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCommon(device).subscribe((res) => {
        this.values.common_mass = res[0].mass;
        this.values.common_water = res[0].water;
        this.values.common_volume = res[0].volume;
      });
    });

   }

  ngOnInit() {
    const mixs = this.navParams.get('mixs'); // this.navParams.data.excludedTracks;
    const inputs = this.navParams.get('inputs'); // this.navParams.data.excludedTracks;
    
    this.mixId = mixs[0].id;

    this.values.mix_volume = mixs[0].volume;
    this.values.input_slump = inputs.slump;
    this.values.input_temp = inputs.temp;
    this.values.input_concrete = inputs.concrete;
    this.values.input_water = inputs.water;
    this.values.input_i_pressure = inputs.iPressure;
    this.values.input_e_pressure = inputs.ePressure;

    this.values.mass = this.formula.volumeMass(inputs);
    this.values.air = this.formula.airVolume(mixs[0], inputs);
    this.values.quantity = this.formula.unitQuantity(mixs[0], inputs);
    
    
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss();
  }

  openLocalPdf() {
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument('assets/tools.pdf', 'application/pdf', options)
    /*
    let filePath = this.file.applicationDirectory + 'www/assets';
 
    if (this.platform.is('android')) {
      let fakeName = Date.now();
      console.log(filePath);
      this.file.copyFile(filePath, 'tools.pdf', this.file.dataDirectory, `${fakeName}.pdf`).then(result => {
        this.fileOpener.open(result.nativeURL, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      })
    } else {
      // Use Document viewer for iOS for a better UI
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(`${filePath}/tools.pdf`, 'application/pdf', options);
    }
    */

  }

  save() {
    this.postapi.measureResult(this.mixId, this.values).subscribe((res) => {
      this.support.presentToast('저장되었습니다.');
    });
    
  }

  alertPrint() {
    let alert = this.alertCtrl.create({
      message: '해당 결과를 출력 하시겠습니까?',
      header: '알림',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          handler: () => {

            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.then(alert => alert.present());
  }

}
