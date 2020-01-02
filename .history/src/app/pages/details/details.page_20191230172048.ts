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


      console.log(NumberStr(this.results[0].w1_unit, 6));

      const elements = ['Fire', 'Air', 'Water'];

      console.log(typeof(elements.join('')));

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
   
   /*
   result
   .codepage('cp949')
   .start()
   .raw([0x02, 0x06])
   .line(`${this.results[0].cname}`)  //사업장
   .line(`${this.results[0].ct_name}`)  //계약자
   .line(`${this.results[0].sname}`)  //현장명
   .line(`${this.results[0].memo}`) //메모
   .line(`${this.results[0].datetime}`) //날짜
   .line(`${this.results[0].mixnum}`) //배합번호
   .line(NumberStr(this.results[0].w1_unit, 6) + NumberStr(this.results[0].w1_density, 7))
   .line(NumberStr(this.results[0].w2_unit, 6) + NumberStr(this.results[0].w2_density, 7))
   .line(NumberStr(this.results[0].w3_unit, 6) + NumberStr(this.results[0].w3_density, 7))
   .line(NumberStr(this.results[0].c1_unit, 6) + NumberStr(this.results[0].c1_density, 7))
   .line(NumberStr(this.results[0].c2_unit, 6) + NumberStr(this.results[0].c2_density, 7))
   .line(NumberStr(this.results[0].c3_unit, 6) + NumberStr(this.results[0].c3_density, 7))
   .line(NumberStr(this.results[0].mad1_unit, 6) + NumberStr(this.results[0].mad1_density, 7))
   .line(NumberStr(this.results[0].mad2_unit, 6) + NumberStr(this.results[0].mad2_density, 7))
   .line(NumberStr(this.results[0].mad3_unit, 6) + NumberStr(this.results[0].mad3_density, 7))
   .line(NumberStr(this.results[0].s1_unit, 6) + NumberStr(this.results[0].s1_density, 7))
   .line(NumberStr(this.results[0].s2_unit, 6) + NumberStr(this.results[0].s2_density, 7))
   .line(NumberStr(this.results[0].s3_unit, 6) + NumberStr(this.results[0].s3_density, 7))
   .line(NumberStr(this.results[0].g1_unit, 6) + NumberStr(this.results[0].g1_density, 7))
   .line(NumberStr(this.results[0].g2_unit, 6) + NumberStr(this.results[0].g2_density, 7))
   .line(NumberStr(this.results[0].g3_unit, 6) + NumberStr(this.results[0].g3_density, 7))
   .line(NumberStr(this.results[0].ad1_unit, 6) + NumberStr(this.results[0].ad1_density, 7))
   .line(NumberStr(this.results[0].ad2_unit, 6) + NumberStr(this.results[0].ad2_density, 7))
   .line(NumberStr(this.results[0].ad3_unit, 6) + NumberStr(this.results[0].ad3_density, 7))
   .line(NumberStr(this.results[0].air, 6)) // 목표공기량
   .line(NumberStr(this.results[0].aggregate, 6)) // 골재수정계수
   .line(NumberStr(this.results[0].wet, 6)) // 시멘트 습윤밀도
   .line(NumberStr(this.results[0].common_mass, 7)) // 용기질량
   .line(NumberStr(this.results[0].common_water, 7)) // 용기+물
   .line(NumberStr(this.results[0].common_volume, 7)) // 용기용적
   .line(NumberStr(this.results[0].input_slump, 7)) // 슬럼프
   .line(NumberStr(this.results[0].input_temp, 7)) // 온도
   .line(NumberStr(this.results[0].input_before, 7)) // 주수전질량
   .line(NumberStr(this.results[0].input_after, 7)) // 주수후질량
   .line(NumberStr(this.results[0].input_i_pressure, 7)) // 초기압력
   .line(NumberStr(this.results[0].input_e_pressure, 7)) // 평형압력
   .line(NumberStr(this.results[0].mix_volume, 7)) // 이론용적
   .line(NumberStr(this.results[0].result_mass, 7)) // 단위용적질량
   .line(NumberStr(this.results[0].result_air, 7)) // 공기량
   .line(NumberStr(this.results[0].result_quantity, 7)) // 단위수량
   .end()
   */

   result
   .codepage('cp949')
   .line(`${this.results[0].cname}`)  //사업장
   .line(NumberStr(this.results[0].w2_unit, 6) + NumberStr(this.results[0].w2_density, 7))
   .line(NumberStr(this.results[0].w3_unit, 6) + NumberStr(this.results[0].w3_density, 7))
   .line(NumberStr(this.results[0].c1_unit, 6) + NumberStr(this.results[0].c1_density, 7))
   .line(NumberStr(this.results[0].c2_unit, 6) + NumberStr(this.results[0].c2_density, 7))
   
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
          handler: (res) => {
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

function NumberStr(tempstr: string, n: number) {
  let temp, k = 1;
  const i = tempstr.length;

  if (i > n) {
    console.log('Overflow Digit');
    return;
  }
  if(n == 6) {
    temp = '      ';
  } else {
    temp = '       ';
  }
  for(let j=n-i; j < n; k++) {
    temp[j+1] = tempstr.charAt(k);
  }
  return temp;
}

/*
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
*/

