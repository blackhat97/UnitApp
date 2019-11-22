import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { BluetoothService } from 'src/app/providers/providers';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';

declare var Socket: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit {

  
  printerUUID: string;
  DEVICEID = environment.device_id;

  isConnected = false;

  resultId : string;
  results: any;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public getapi: GetApiService,
    private storage: Storage,
    private bluetooth: BluetoothService,
    private support: SupportService,
    public alertCtrl: AlertController,
    private postapi: PostApiService,
    private router: Router
  ) {
    this.resultId = this.activatedRoute.snapshot.paramMap.get('id');


  }

  ionViewWillEnter(){

    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.printerUUID = res[0].printer_uuid;
      });
    });
    this.getapi.measureResult(this.resultId).subscribe((res) => {
      this.results = res;
      console.log(res);
    });
    
  }

  ngOnInit() {

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '더보기',
      buttons: [{
        text: '인쇄',
        icon: 'print',
        handler: () => {
          this.printerCheck();
        }
      },{
        text: '삭제',
        icon: 'trash',
        handler: () => {
          this.delete();
        }
      },{
        text: '취소',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  checkConnection(seleccion) {
    this.disconnect().then(() => {
      this.bluetooth.deviceConnection(seleccion).then(success => {                  
        this.isConnected = true;
        this.outputs();

      }, fail => {
        this.isConnected = false;
      });
    });
  }

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }

  printerCheck() {
    let alert = this.alertCtrl.create({
      message: '출력하시겠습니까?',
      buttons: [{
        text: '취소',
        role: 'cancel',
      },{
          text: '확인',
          role: 'submit',
          handler: (data) => {
            this.checkConnection(this.printerUUID);

          }
        }]
    });
    alert.then(alert => alert.present());
  }


  outputs() {

    
    let message = `
    날짜          | ${this.results[0].datetime}\n
    배합번호          | ${this.results[0].mixnum}\n
    사업장           | ${this.results[0].cname}\n
    계약자           | ${this.results[0].ct_name}\n
    현장명           | ${this.results[0].sname}\n
    =================\n
    용기질량(g)       | ${this.results[0].common_mass}\n
    용기+물(g)        | ${this.results[0].common_water}\n
    용기용적(ml)       | ${this.results[0].common_volume}\n
    슬럼프(mm)        | ${this.results[0].input_slump}\n
    온도(°C)          | ${this.results[0].input_temp}\n
    주수전질량(g)       | ${this.results[0].input_before}\n
    주수후질량(g)       | ${this.results[0].input_after}\n
    초기압력(kPa)      | ${this.results[0].input_i_pressure}\n
    평형압력(kPa)      | ${this.results[0].input_e_pressure}\n
    이론용적(m³)       | ${this.results[0].mix_volume}\n
    단위용적질량(kg/m³) | ${this.results[0].result_mass}\n
    공기량(%)         | ${this.results[0].result_air}\n
    단위수량(kg/m³)    | ${this.results[0].result_quantity}`;
    
   
   //let message = `날씨, 단위수량, 단위용적질량`;

   //const encoder = new EscPosEncoder();
   //const result = encoder.initialize();
   /*
   result
   .codepage('cp949')
   .text('안녕하세요')
    */

    this.bluetooth.dataInOut(message).subscribe(data => {
      if (data !== 'BLUETOOTH.NOT_CONNECTED') {
        try {
          if (data) {
            const entry = JSON.parse(data);
            console.log(entry);
          }
        } catch (error) {
          console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
        }
        console.log(data);
      } else {
        this.support.presentToast(data);
      }
    });

  }

  ngOnDestroy() {
    this.disconnect();
  }


  async delete() {
    const alert = await this.alertCtrl.create({
      header: '삭제',
      message: '해당 결과를 삭제 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: _ => {
            this.postapi.deleteResult(this.resultId).subscribe((res: any) => {
              this.router.navigate(['/complete-list']);
              this.support.presentToast('삭제되었습니다.');
            });
          }
        }
      ],
    });
    await alert.present();
  }

}
