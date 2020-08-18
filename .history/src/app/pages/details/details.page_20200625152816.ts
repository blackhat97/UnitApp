import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, IonContent } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { BluetoothService } from 'src/app/providers/providers';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content: IonContent;

  printerUUID: string;
  DEVICEID = environment.device_id;

  isConnected = false;

  resultId : string;
  results: any;
  
  timestamp: string = "";
  isChecked: boolean = true;
  DS: number = 0;

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
    public loadingController: LoadingController,
    private bluetoothSerial: BluetoothSerial,
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

      this.timestamp = `${(this.results[0].datetime).split(/[T.]+/)[0]} ${(this.results[0].datetime).split(/[T.]+/)[1]}`;
      this.countData();
      
    },
    (err) => {this.support.presentToast(err)});
    
  }

  ngOnInit(): void {
    //this.scrollToBottom();
  }

  scrollToBottom(): void {
    //window.scrollTo(0, 2000);
    this.content.scrollToTop(300);

  }

  checkboxClick(e) {
    this.countData();
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
        },
      },{
        text: '닫기',
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
          this.bluetoothSerial.subscribeRawData().subscribe((output) => {
            this.bluetoothSerial.read().then((output) => { console.log("read data : " +JSON.stringify(output))});
          });
          this.support.showAlert("출력 성공!");
        });

      }, fail => {
        this.isConnected = false;
        this.support.showAlert("연결에 문제가 생겼습니다. 다시 시도해주세요!");
      });
    });
  }

  prepareToPrint() {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    if (this.isChecked) {
      result
      .codepage('cp949')
      .start()
      .raw([(this.DS >> 8), (this.DS & 0xff)])
      .line(`${this.results[0].cname}`)  //사업장
      .line(`${this.results[0].ct_name}`)  //계약자
      .line(`${this.results[0].sname}`)  //현장명
      .line(`${this.results[0].memo}`) //메모
      .line(`${(this.results[0].datetime).split(/[T.]+/)[0]} ${(this.results[0].datetime).split(/[T.]+/)[1]}`)  //날짜
      .line(`${this.results[0].mixnum}`) //배합번호
      .line(NumberStr((this.results[0].w1_unit).toString(), 6) + NumberStr((this.results[0].w1_density).toString(), 7))
      .line(NumberStr((this.results[0].w2_unit).toString(), 6) + NumberStr((this.results[0].w2_density).toString(), 7))
      .line(NumberStr((this.results[0].w3_unit).toString(), 6) + NumberStr((this.results[0].w3_density).toString(), 7))
      .line(NumberStr((this.results[0].c1_unit).toString(), 6) + NumberStr((this.results[0].c1_density).toString(), 7))
      .line(NumberStr((this.results[0].c2_unit).toString(), 6) + NumberStr((this.results[0].c2_density).toString(), 7))
      .line(NumberStr((this.results[0].c3_unit).toString(), 6) + NumberStr((this.results[0].c3_density).toString(), 7))
      .line(NumberStr((this.results[0].mad1_unit).toString(), 6) + NumberStr((this.results[0].mad1_density).toString(), 7))
      .line(NumberStr((this.results[0].mad2_unit).toString(), 6) + NumberStr((this.results[0].mad2_density).toString(), 7))
      .line(NumberStr((this.results[0].mad3_unit).toString(), 6) + NumberStr((this.results[0].mad3_density).toString(), 7))
      .line(NumberStr((this.results[0].s1_unit).toString(), 6) + NumberStr((this.results[0].s1_density).toString(), 7))
      .line(NumberStr((this.results[0].s2_unit).toString(), 6) + NumberStr((this.results[0].s2_density).toString(), 7))
      .line(NumberStr((this.results[0].s3_unit).toString(), 6) + NumberStr((this.results[0].s3_density).toString(), 7))
      .line(NumberStr((this.results[0].g1_unit).toString(), 6) + NumberStr((this.results[0].g1_density).toString(), 7))
      .line(NumberStr((this.results[0].g2_unit).toString(), 6) + NumberStr((this.results[0].g2_density).toString(), 7))
      .line(NumberStr((this.results[0].g3_unit).toString(), 6) + NumberStr((this.results[0].g3_density).toString(), 7))
      .line(NumberStr((this.results[0].ad1_unit).toString(), 6) + NumberStr((this.results[0].ad1_density).toString(), 7))
      .line(NumberStr((this.results[0].ad2_unit).toString(), 6) + NumberStr((this.results[0].ad2_density).toString(), 7))
      .line(NumberStr((this.results[0].ad3_unit).toString(), 6) + NumberStr((this.results[0].ad3_density).toString(), 7))
      .line(NumberStr((this.results[0].air).toString(), 6)) // 목표공기량
      .line(NumberStr((this.results[0].aggregate).toString(), 6)) // 골재수정계수
      .line(NumberStr((this.results[0].wet).toString(), 6)) // 시멘트 습윤밀도
      .line(NumberStr((this.results[0].common_mass).toString(), 7)) // 용기질량
      .line(NumberStr((this.results[0].common_water).toString(), 7)) // 용기+물
      .line(NumberStr((this.results[0].common_volume).toString(), 7)) // 용기용적
      .line(NumberStr((this.results[0].input_slump).toString(), 7)) // 슬럼프
      .line(NumberStr((this.results[0].input_temp).toString(), 7)) // 온도
      .line(NumberStr((this.results[0].input_before).toString(), 7)) // 주수전질량
      .line(NumberStr((this.results[0].input_after).toString(), 7)) // 주수후질량
      .line(NumberStr((this.results[0].input_i_pressure).toString(), 7)) // 초기압력
      .line(NumberStr((this.results[0].input_e_pressure).toString(), 7)) // 평형압력
      .line(NumberStr(((this.results[0].mix_volume / 1000).toFixed(3)).toString(), 7)) // 이론용적
      .line(NumberStr((this.results[0].result_mass).toString(), 7)) // 단위용적질량
      .line(NumberStr((this.results[0].result_air).toString(), 7)) // 공기량
      .line(NumberStr((this.results[0].result_quantity).toString(), 7)) // 단위수량
      .end()
    } else {
      result
      .codepage('cp949')
      .start()
      .raw([(this.DS >> 8), (this.DS & 0xff)])
      .line(`${this.results[0].cname}`)  //사업장
      .line(`${this.results[0].ct_name}`)  //계약자
      .line(`${this.results[0].sname}`)  //현장명
      .line(`${this.results[0].memo}`) //메모
      .line(`${(this.results[0].datetime).split(/[T.]+/)[0]}`) // 날짜
      .line(`${this.results[0].mixnum}`) //배합번호
      .line(NumberStr((this.results[0].w1_unit).toString(), 6) + NumberStr((this.results[0].w1_density).toString(), 7))
      .line(NumberStr((this.results[0].w2_unit).toString(), 6) + NumberStr((this.results[0].w2_density).toString(), 7))
      .line(NumberStr((this.results[0].w3_unit).toString(), 6) + NumberStr((this.results[0].w3_density).toString(), 7))
      .line(NumberStr((this.results[0].c1_unit).toString(), 6) + NumberStr((this.results[0].c1_density).toString(), 7))
      .line(NumberStr((this.results[0].c2_unit).toString(), 6) + NumberStr((this.results[0].c2_density).toString(), 7))
      .line(NumberStr((this.results[0].c3_unit).toString(), 6) + NumberStr((this.results[0].c3_density).toString(), 7))
      .line(NumberStr((this.results[0].mad1_unit).toString(), 6) + NumberStr((this.results[0].mad1_density).toString(), 7))
      .line(NumberStr((this.results[0].mad2_unit).toString(), 6) + NumberStr((this.results[0].mad2_density).toString(), 7))
      .line(NumberStr((this.results[0].mad3_unit).toString(), 6) + NumberStr((this.results[0].mad3_density).toString(), 7))
      .line(NumberStr((this.results[0].s1_unit).toString(), 6) + NumberStr((this.results[0].s1_density).toString(), 7))
      .line(NumberStr((this.results[0].s2_unit).toString(), 6) + NumberStr((this.results[0].s2_density).toString(), 7))
      .line(NumberStr((this.results[0].s3_unit).toString(), 6) + NumberStr((this.results[0].s3_density).toString(), 7))
      .line(NumberStr((this.results[0].g1_unit).toString(), 6) + NumberStr((this.results[0].g1_density).toString(), 7))
      .line(NumberStr((this.results[0].g2_unit).toString(), 6) + NumberStr((this.results[0].g2_density).toString(), 7))
      .line(NumberStr((this.results[0].g3_unit).toString(), 6) + NumberStr((this.results[0].g3_density).toString(), 7))
      .line(NumberStr((this.results[0].ad1_unit).toString(), 6) + NumberStr((this.results[0].ad1_density).toString(), 7))
      .line(NumberStr((this.results[0].ad2_unit).toString(), 6) + NumberStr((this.results[0].ad2_density).toString(), 7))
      .line(NumberStr((this.results[0].ad3_unit).toString(), 6) + NumberStr((this.results[0].ad3_density).toString(), 7))
      .line(NumberStr((this.results[0].air).toString(), 6)) // 목표공기량
      .line(NumberStr((this.results[0].aggregate).toString(), 6)) // 골재수정계수
      .line(NumberStr((this.results[0].wet).toString(), 6)) // 시멘트 습윤밀도
      .line(NumberStr((this.results[0].common_mass).toString(), 7)) // 용기질량
      .line(NumberStr((this.results[0].common_water).toString(), 7)) // 용기+물
      .line(NumberStr((this.results[0].common_volume).toString(), 7)) // 용기용적
      .line(NumberStr((this.results[0].input_slump).toString(), 7)) // 슬럼프
      .line(NumberStr((this.results[0].input_temp).toString(), 7)) // 온도
      .line(NumberStr((this.results[0].input_before).toString(), 7)) // 주수전질량
      .line(NumberStr((this.results[0].input_after).toString(), 7)) // 주수후질량
      .line(NumberStr((this.results[0].input_i_pressure).toString(), 7)) // 초기압력
      .line(NumberStr((this.results[0].input_e_pressure).toString(), 7)) // 평형압력
      .line(NumberStr(((this.results[0].mix_volume / 1000).toFixed(3)).toString(), 7)) // 이론용적
      .line(NumberStr((this.results[0].result_mass).toString(), 7)) // 단위용적질량
      .line(NumberStr((this.results[0].result_air).toString(), 7)) // 공기량
      .line(NumberStr((this.results[0].result_quantity).toString(), 7)) // 단위수량
      .end()
   }

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

  async updateMemo() {
    const alert = await this.alertCtrl.create({
      header: '메모 업데이트',
      inputs: [
        {
          name: 'memo',
          value: this.results[0].memo,
          placeholder: '메모입력'
        },
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
            
            this.postapi.updateMemo(this.resultId, {memo: data.memo}).subscribe( _ => {
              this.getapi.measureResult(this.resultId).subscribe((res) => {
                this.results[0].memo = res[0].memo;
                this.countData();
              });
              this.support.presentToast("업데이트 되었습니다.");
            });
          }
        }
      ],
    });
    await alert.present();
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
              this.router.navigate(['/app/complete-list']);
              this.support.presentToast('삭제되었습니다.');
            });
          }
        }
      ],
    });
    await alert.present();
  }

  countData() {
    const encoder = new EscPosEncoder();
    const escpos = encoder.initialize();

    if(this.isChecked) {  
      escpos
      .codepage('cp949')
      .line(`${this.results[0].cname}`)  //사업장
      .line(`${this.results[0].ct_name}`)  //계약자
      .line(`${this.results[0].sname}`)  //현장명
      .line(`${this.results[0].memo}`) //메모
      .line(`${(this.results[0].datetime).split(/[T.]+/)[0]} ${(this.results[0].datetime).split(/[T.]+/)[1]}`)  //날짜
      .line(`${this.results[0].mixnum}`) //배합번호
      .line(NumberStr((this.results[0].w1_unit).toString(), 6) + NumberStr((this.results[0].w1_density).toString(), 7))
      .line(NumberStr((this.results[0].w2_unit).toString(), 6) + NumberStr((this.results[0].w2_density).toString(), 7))
      .line(NumberStr((this.results[0].w3_unit).toString(), 6) + NumberStr((this.results[0].w3_density).toString(), 7))
      .line(NumberStr((this.results[0].c1_unit).toString(), 6) + NumberStr((this.results[0].c1_density).toString(), 7))
      .line(NumberStr((this.results[0].c2_unit).toString(), 6) + NumberStr((this.results[0].c2_density).toString(), 7))
      .line(NumberStr((this.results[0].c3_unit).toString(), 6) + NumberStr((this.results[0].c3_density).toString(), 7))
      .line(NumberStr((this.results[0].mad1_unit).toString(), 6) + NumberStr((this.results[0].mad1_density).toString(), 7))
      .line(NumberStr((this.results[0].mad2_unit).toString(), 6) + NumberStr((this.results[0].mad2_density).toString(), 7))
      .line(NumberStr((this.results[0].mad3_unit).toString(), 6) + NumberStr((this.results[0].mad3_density).toString(), 7))
      .line(NumberStr((this.results[0].s1_unit).toString(), 6) + NumberStr((this.results[0].s1_density).toString(), 7))
      .line(NumberStr((this.results[0].s2_unit).toString(), 6) + NumberStr((this.results[0].s2_density).toString(), 7))
      .line(NumberStr((this.results[0].s3_unit).toString(), 6) + NumberStr((this.results[0].s3_density).toString(), 7))
      .line(NumberStr((this.results[0].g1_unit).toString(), 6) + NumberStr((this.results[0].g1_density).toString(), 7))
      .line(NumberStr((this.results[0].g2_unit).toString(), 6) + NumberStr((this.results[0].g2_density).toString(), 7))
      .line(NumberStr((this.results[0].g3_unit).toString(), 6) + NumberStr((this.results[0].g3_density).toString(), 7))
      .line(NumberStr((this.results[0].ad1_unit).toString(), 6) + NumberStr((this.results[0].ad1_density).toString(), 7))
      .line(NumberStr((this.results[0].ad2_unit).toString(), 6) + NumberStr((this.results[0].ad2_density).toString(), 7))
      .line(NumberStr((this.results[0].ad3_unit).toString(), 6) + NumberStr((this.results[0].ad3_density).toString(), 7))
      .line(NumberStr((this.results[0].air).toString(), 6)) // 목표공기량
      .line(NumberStr((this.results[0].aggregate).toString(), 6)) // 골재수정계수
      .line(NumberStr((this.results[0].wet).toString(), 6)) // 시멘트 습윤밀도
      .line(NumberStr((this.results[0].common_mass).toString(), 7)) // 용기질량
      .line(NumberStr((this.results[0].common_water).toString(), 7)) // 용기+물
      .line(NumberStr((this.results[0].common_volume).toString(), 7)) // 용기용적
      .line(NumberStr((this.results[0].input_slump).toString(), 7)) // 슬럼프
      .line(NumberStr((this.results[0].input_temp).toString(), 7)) // 온도
      .line(NumberStr((this.results[0].input_before).toString(), 7)) // 주수전질량
      .line(NumberStr((this.results[0].input_after).toString(), 7)) // 주수후질량
      .line(NumberStr((this.results[0].input_i_pressure).toString(), 7)) // 초기압력
      .line(NumberStr((this.results[0].input_e_pressure).toString(), 7)) // 평형압력
      .line(NumberStr(((this.results[0].mix_volume / 1000).toFixed(3)).toString(), 7)) // 이론용적
      .line(NumberStr((this.results[0].result_mass).toString(), 7)) // 단위용적질량
      .line(NumberStr((this.results[0].result_air).toString(), 7)) // 공기량
      .line(NumberStr((this.results[0].result_quantity).toString(), 7)) // 단위수량
      
    } else {
      escpos
      .codepage('cp949')
      .line(`${this.results[0].cname}`)  //사업장
      .line(`${this.results[0].ct_name}`)  //계약자
      .line(`${this.results[0].sname}`)  //현장명
      .line(`${this.results[0].memo}`) //메모
      .line(``)  //날짜
      .line(`${this.results[0].mixnum}`) //배합번호
      .line(NumberStr((this.results[0].w1_unit).toString(), 6) + NumberStr((this.results[0].w1_density).toString(), 7))
      .line(NumberStr((this.results[0].w2_unit).toString(), 6) + NumberStr((this.results[0].w2_density).toString(), 7))
      .line(NumberStr((this.results[0].w3_unit).toString(), 6) + NumberStr((this.results[0].w3_density).toString(), 7))
      .line(NumberStr((this.results[0].c1_unit).toString(), 6) + NumberStr((this.results[0].c1_density).toString(), 7))
      .line(NumberStr((this.results[0].c2_unit).toString(), 6) + NumberStr((this.results[0].c2_density).toString(), 7))
      .line(NumberStr((this.results[0].c3_unit).toString(), 6) + NumberStr((this.results[0].c3_density).toString(), 7))
      .line(NumberStr((this.results[0].mad1_unit).toString(), 6) + NumberStr((this.results[0].mad1_density).toString(), 7))
      .line(NumberStr((this.results[0].mad2_unit).toString(), 6) + NumberStr((this.results[0].mad2_density).toString(), 7))
      .line(NumberStr((this.results[0].mad3_unit).toString(), 6) + NumberStr((this.results[0].mad3_density).toString(), 7))
      .line(NumberStr((this.results[0].s1_unit).toString(), 6) + NumberStr((this.results[0].s1_density).toString(), 7))
      .line(NumberStr((this.results[0].s2_unit).toString(), 6) + NumberStr((this.results[0].s2_density).toString(), 7))
      .line(NumberStr((this.results[0].s3_unit).toString(), 6) + NumberStr((this.results[0].s3_density).toString(), 7))
      .line(NumberStr((this.results[0].g1_unit).toString(), 6) + NumberStr((this.results[0].g1_density).toString(), 7))
      .line(NumberStr((this.results[0].g2_unit).toString(), 6) + NumberStr((this.results[0].g2_density).toString(), 7))
      .line(NumberStr((this.results[0].g3_unit).toString(), 6) + NumberStr((this.results[0].g3_density).toString(), 7))
      .line(NumberStr((this.results[0].ad1_unit).toString(), 6) + NumberStr((this.results[0].ad1_density).toString(), 7))
      .line(NumberStr((this.results[0].ad2_unit).toString(), 6) + NumberStr((this.results[0].ad2_density).toString(), 7))
      .line(NumberStr((this.results[0].ad3_unit).toString(), 6) + NumberStr((this.results[0].ad3_density).toString(), 7))
      .line(NumberStr((this.results[0].air).toString(), 6)) // 목표공기량
      .line(NumberStr((this.results[0].aggregate).toString(), 6)) // 골재수정계수
      .line(NumberStr((this.results[0].wet).toString(), 6)) // 시멘트 습윤밀도
      .line(NumberStr((this.results[0].common_mass).toString(), 7)) // 용기질량
      .line(NumberStr((this.results[0].common_water).toString(), 7)) // 용기+물
      .line(NumberStr((this.results[0].common_volume).toString(), 7)) // 용기용적
      .line(NumberStr((this.results[0].input_slump).toString(), 7)) // 슬럼프
      .line(NumberStr((this.results[0].input_temp).toString(), 7)) // 온도
      .line(NumberStr((this.results[0].input_before).toString(), 7)) // 주수전질량
      .line(NumberStr((this.results[0].input_after).toString(), 7)) // 주수후질량
      .line(NumberStr((this.results[0].input_i_pressure).toString(), 7)) // 초기압력
      .line(NumberStr((this.results[0].input_e_pressure).toString(), 7)) // 평형압력
      .line(NumberStr(((this.results[0].mix_volume / 1000).toFixed(3)).toString(), 7)) // 이론용적
      .line(NumberStr((this.results[0].result_mass).toString(), 7)) // 단위용적질량
      .line(NumberStr((this.results[0].result_air).toString(), 7)) // 공기량
      .line(NumberStr((this.results[0].result_quantity).toString(), 7)) // 단위수량
      
    }
    this.DS = (escpos.encode()).length - 5;
    console.log(this.DS);
  }

}

function NumberStr(tempstr: string, n: number) {
  let temp = new Array(), k=0;
  const i = tempstr.length;

  if (i > n) {
    console.log('Overflow Digit');
    return;
  }
  if(n == 6) {
    temp = [-1,-1,-1,-1,-1,-1];
  } else {
    temp = [-1,-1,-1,-1,-1,-1,-1];
  }

  for(let j=n-i; j < n; j++) {
    temp[j] = tempstr.charAt(k);
    k++;
  }
  let str = temp.join('');
  return str.replace(/-1/g,' ');
}
