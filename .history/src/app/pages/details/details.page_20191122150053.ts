import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { BluetoothService } from 'src/app/providers/providers';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { hexTable } from 'src/app/providers/printer/cp949-tables';
import { commands } from 'src/app/providers/printer/printer-commands';

declare var test;
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
    private router: Router,
    public loadingController: LoadingController
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
          this.prepareToPrint();
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Printing...',
      duration: 2000
    });
    await loading.present();
  }

  print(device, data) {
    this.presentLoading();
    this.disconnect().then(() => {
      this.bluetooth.deviceConnection(device).then(success => {  
        this.isConnected = true;
        
        this.bluetooth.printData(data)
        .then((printStatus) => {
          console.log(printStatus);
          this.support.showAlert("출력 성공!");

        });
        /*
        this.bluetooth.dataInOut(data).subscribe(res => {
          
          if (res !== 'BLUETOOTH.NOT_CONNECTED') {
            try {
              if (res) {
                const entry = JSON.parse(res);
                console.log(entry);
                this.support.showAlert(entry);
              }
            } catch (error) {
              console.log(error);
              this.support.showAlert(`[bluetooth-168]: ${JSON.stringify(error)}`);
            }
          } else {
            this.support.showAlert("출력 성공!");
            this.disconnect();
          }
        });
        */

      }, fail => {
        this.isConnected = false;
        console.log(fail);
        this.support.showAlert("연결에 문제가 생겼습니다. 다시 시도해주세요!");
      });
    });
  }

  prepareToPrint() {
   
   const encoder = new EscPosEncoder();
   const result = encoder.initialize();
   result
   .codepage('cp949')
   .line(`사업장: ${this.results[0].cname}`)
   .line(`계약자: ${this.results[0].ct_name}`)
   .line(`현장명: ${this.results[0].sname}`)
   .line(`날짜: ${this.results[0].datetime}`)
   .line(`배합번호: ${this.results[0].mixnum}`)
   .line(`W1: ${this.results[0].w1_unit} | ${this.results[0].w1_density}`)
   .line(`W2: ${this.results[0].w2_unit} | ${this.results[0].w2_density}`)
   .line(`W3: ${this.results[0].w3_unit} | ${this.results[0].w3_density}`)
   .line(`C1: ${this.results[0].c1_unit} | ${this.results[0].c1_density}`)
   .line(`C2: ${this.results[0].c2_unit} | ${this.results[0].c2_density}`)
   .line(`C3: ${this.results[0].c3_unit} | ${this.results[0].c3_density}`)
   .line(`m.ad1: ${this.results[0].mad1_unit} | ${this.results[0].mad1_density}`)
   .line(`m.ad2: ${this.results[0].mad2_unit} | ${this.results[0].mad2_density}`)
   .line(`m.ad3: ${this.results[0].mad3_unit} | ${this.results[0].mad3_density}`)
   .line(`S1: ${this.results[0].s1_unit} | ${this.results[0].s1_density}`)
   .line(`S2: ${this.results[0].s2_unit} | ${this.results[0].s2_density}`)
   .line(`S3: ${this.results[0].s3_unit} | ${this.results[0].s3_density}`)
   .line(`G1: ${this.results[0].g1_unit} | ${this.results[0].g1_density}`)
   .line(`G2: ${this.results[0].g2_unit} | ${this.results[0].g2_density}`)
   .line(`G3: ${this.results[0].g3_unit} | ${this.results[0].g3_density}`)
   .line(`AD1: ${this.results[0].ad1_unit} | ${this.results[0].ad1_density}`)
   .line(`AD2: ${this.results[0].ad2_unit} | ${this.results[0].ad2_density}`)
   .line(`AD3: ${this.results[0].ad3_unit} | ${this.results[0].ad3_density}`)
   .line(`목표공기량(%): ${this.results[0].air}`)
   .line(`골재수정계수: ${this.results[0].aggregate}`)
   .line(`시멘트 습윤밀도: ${this.results[0].wet}`)
   .line(`용기질량(g): ${this.results[0].common_mass}`)
   .line(`용기+물(g): ${this.results[0].common_water}`)
   .line(`용기용적(ml): ${this.results[0].common_volume}`)
   .line(`슬럼프(mm): ${this.results[0].input_slump}`)
   .line(`온도(°C): ${this.results[0].input_temp}`)
   .line(`주수전질량(g): ${this.results[0].input_before}`)
   .line(`주수후질량(g): ${this.results[0].input_after}`)
   .line(`초기압력(kPa): ${this.results[0].input_i_pressure}`)
   .line(`평형압력(kPa): ${this.results[0].input_e_pressure}`)
   .line(`이론용적(m³): ${this.results[0].mix_volume}`)
   .line(`단위용적질량(kg/m³): ${this.results[0].result_mass}`)
   .line(`공기량(%): ${this.results[0].result_air}`)
   .line(`단위수량(kg/m³): ${this.results[0].result_quantity}`)


   //const result = this.cp949_convert(data);
   this.mountAlertBt(result.encode());

  }

  mountAlertBt(data) {
    let alert = this.alertCtrl.create({
      message: '출력하시겠습니까?',
      buttons: [{
        text: '취소',
        role: 'cancel',
      },{
          text: '확인',
          role: 'submit',
          handler: (data) => {
            this.print(this.printerUUID, data);
          }
        }]
    });
    alert.then(alert => alert.present());
  }


  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
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

  
function cp949_convert(str){
  const len = str.length;
  let res = '';
  let ch = 0;
  for(let i = 0;i<len;i++){
    ch = str.charCodeAt(i).toString(16);
    if(hexTable[ch]){
      res += String.fromCharCode(parseInt(hexTable[ch], 16));
    }else{
      res += str.charAt(i);
    }
  }
  return res;
}


