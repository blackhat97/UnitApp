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
    console.log(data);
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
   
  
   result
   .codepage('cp949')
   .bold(true)
   .line('┌──────────────┐')
   .bold(false)
   .underline(true)
   .tableCustom([
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"사업장:", align:"LEFT", width:0.25 },
    { text:this.results[0].cname, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"계약자:", align:"LEFT", width:0.25 },
    { text:this.results[0].ct_name, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"현장명:", align:"LEFT", width:0.25 },
    { text:this.results[0].sname, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"메모:", align:"LEFT", width:0.25 },
    { text:this.results[0].memo, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"날짜:", align:"LEFT", width:0.25 },
    { text:this.results[0].datetime, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"배합번호", align:"LEFT", width:0.25 },
    { text:this.results[0].mixnum, align:"LEFT", width:0.65},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"시방배합", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:"질량", align:"CENTER", width:0.2},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:"밀도", align:"CENTER", width:0.2},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .underline(false)
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (W1) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (W2) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (W3) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].w3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (C1) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (C2) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (C3) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].c3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(m.ad1)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(m.ad2)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(m.ad3)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mad3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (S1) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (S2) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (S3) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].s3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (G1) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (G2) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:" (G3) ", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].g3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(AD1)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad1_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad1_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(AD2)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad2_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad2_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.1 }, 
    { text:"(AD3)", align:"CENTER", width:0.35 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad3_unit, align:"RIGHT", width:0.25},
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].ad3_density, align:"RIGHT", width:0.25},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .underline(true)
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"목표공기량(%)", align:"LEFT", width:0.4 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].air, align:"RIGHT", width:0.25},
    { text:'', align:"RIGHT", width:0.2},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"골재수정계수", align:"LEFT", width:0.4 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].aggregate, align:"RIGHT", width:0.25},
    { text:'', align:"RIGHT", width:0.2},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([
    { text:"│", align:"LEFT", width:0.05 },  
    { text:"시멘트 습윤밀도", align:"LEFT", width:0.4 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].wet, align:"RIGHT", width:0.25},
    { text:'', align:"RIGHT", width:0.2},
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"측정결과", align:"CENTER", width:0.9 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .underline(false)
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"용기질량(g)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].common_mass, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"용기+물(g)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].common_water, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"용기용적(ml)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].common_volume, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"슬럼프(mm)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_slump, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 },
    { text:"온도(°C)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_temp, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"주수전질량(g)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_before, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"주수후질량(g)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_after, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"초기압력(kPa)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_i_pressure, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"평형압력(kPa)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].input_e_pressure, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"이론용적(m³)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].mix_volume, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"단위용적질량(kg/m³)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].result_mass, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"공기량(%)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].result_air, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .tableCustom([ 
    { text:"│", align:"LEFT", width:0.05 }, 
    { text:"단위수량(kg/m³)", align:"CENTER", width:0.55 },
    { text:"│", align:"CENTER", width:0.05 }, 
    { text:this.results[0].result_quantity, align:"CENTER", width:0.3 },
    { text:"│", align:"RIGHT", width:0.05 },
   ])
   .bold(true)
   .line('└──────────────┘')
   .newline()
   .newline()
   .newline()
   .newline()

  /*
  result
  .codepage('cp949')
  .underline(true)
  .line('잘자')
  .underline(false)
  .line('냠냠 테스트')
  .newline()
  .newline()
  .newline()
  */
   

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


