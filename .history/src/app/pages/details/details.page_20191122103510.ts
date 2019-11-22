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

        this.bluetooth.dataInOut(data).subscribe(res => {
          if (res !== 'BLUETOOTH.NOT_CONNECTED') {
            try {
              if (res) {
                const entry = JSON.parse(res);
                this.support.showAlert(entry);
              }
            } catch (error) {
              this.support.showAlert(`[bluetooth-168]: ${JSON.stringify(error)}`);
            }
          } else {
            this.support.showAlert("출력 성공!");
            this.disconnect();
          }
        });

      }, fail => {
        this.isConnected = false;
        this.support.showAlert("연결에 문제가 생겼습니다. 다시 시도해주세요!");
      });
    });
  }

  prepareToPrint() {
    const result = `
    사업장           | ${this.results[0].cname}\n
    계약자           | ${this.results[0].ct_name}\n
    현장명           | ${this.results[0].sname}\n
    날짜          | ${this.results[0].datetime}\n
    배합번호          | ${this.results[0].mixnum}\n
    =================\n
    W1           | ${this.results[0].w1_unit} | ${this.results[0].w1_density}\n
    W2           | ${this.results[0].w2_unit} | ${this.results[0].w2_density}\n
    W3           | ${this.results[0].w3_unit} | ${this.results[0].w3_density}\n
    C1           | ${this.results[0].c1_unit} | ${this.results[0].c1_density}\n
    C2           | ${this.results[0].c2_unit} | ${this.results[0].c2_density}\n
    C3           | ${this.results[0].c3_unit} | ${this.results[0].c3_density}\n
    m.ad1           | ${this.results[0].mad1_unit} | ${this.results[0].mad1_density}\n
    m.ad2           | ${this.results[0].mad2_unit} | ${this.results[0].mad2_density}\n
    m.ad3           | ${this.results[0].mad3_unit} | ${this.results[0].mad3_density}\n
    S1           | ${this.results[0].s1_unit} | ${this.results[0].s1_density}\n
    S2           | ${this.results[0].s2_unit} | ${this.results[0].s2_density}\n
    S3           | ${this.results[0].s3_unit} | ${this.results[0].s3_density}\n
    G1           | ${this.results[0].g1_unit} | ${this.results[0].g1_density}\n
    G2           | ${this.results[0].g2_unit} | ${this.results[0].g2_density}\n
    G3           | ${this.results[0].g3_unit} | ${this.results[0].g3_density}\n
    AD1           | ${this.results[0].ad1_unit} | ${this.results[0].ad1_density}\n
    AD2           | ${this.results[0].ad2_unit} | ${this.results[0].ad2_density}\n
    AD3           | ${this.results[0].ad3_unit} | ${this.results[0].ad3_density}\n
    =================\n
    목표공기량(%)      | ${this.results[0].air}\n
    골재수정계수       | ${this.results[0].aggregate}\n
    시멘트 습윤밀도       | ${this.results[0].wet}\n
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
    
    /*
   const encoder = new EscPosEncoder();
   const result = encoder.initialize();
   
   result
   .codepage('cp949')
   .text('안녕하세요')
   */

    this.mountAlertBt(result);

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




