import { environment } from 'src/environments/environment.prod';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { BluetoothService } from 'src/app/providers/providers';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavParams, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.page.html',
  styleUrls: ['./outcome.page.scss'],
})
export class OutcomePage implements OnInit, OnDestroy {
  //public navParams = new NavParams;

  DEVICEID = environment.device_id;
  printerUUID: string;
  
  DS: number = 0;
  isConnected = false;
  timestamp: string = "";

  mixId: string = '';
  values = {
    cname: '',
    sname: '',
    ct_name: '',
    mixnum: '',
    w1_unit: 0,
    w1_density: 0,
    w2_unit: 0,
    w2_density: 0,
    w3_unit: 0,
    w3_density: 0,
    c1_unit: 0,
    c1_density: 0,
    c2_unit: 0,
    c2_density: 0,
    c3_unit: 0,
    c3_density: 0,
    mad1_unit: 0,
    mad1_density: 0,
    mad2_unit: 0,
    mad2_density: 0,
    mad3_unit: 0,
    mad3_density: 0,
    s1_unit: 0,
    s1_density: 0,
    s2_unit: 0,
    s2_density: 0,
    s3_unit: 0,
    s3_density: 0,
    g1_unit: 0,
    g1_density: 0,
    g2_unit: 0,
    g2_density: 0,
    g3_unit: 0,
    g3_density: 0,
    ad1_unit: 0,
    ad1_density: 0,
    ad2_unit: 0,
    ad2_density: 0,
    ad3_unit: 0,
    ad3_density: 0,

    common_mass: 0,
    common_water: 0,
    common_volume: 0,
    input_slump: 0,
    input_temp: 0,
    input_before: 0,
    input_after: 0,
    input_i_pressure: 0,
    input_e_pressure: 0,
    mix_volume: 0,
    result_mass : '',
    result_air : '',
    result_quantity : '',
    memo : '',
  };

  constructor(
    private location: Location,
    public postapi: PostApiService,
    public formula: FormulaService,
    public getapi: GetApiService,
    public support:SupportService,
    private bluetooth: BluetoothService,
    public activateroute: ActivatedRoute,
    private storage: Storage,

    public loadingController: LoadingController,
    private bluetoothSerial: BluetoothSerial,
    public alertCtrl: AlertController,

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
    this.mixId = this.activateroute.snapshot.paramMap.get('id');
    this.getapi.mixElement(this.mixId).subscribe((mixs: any) => {
      this.values.cname = mixs[0].cname;
      this.values.sname = mixs[0].sname;
      this.values.ct_name = mixs[0].ct_name;
      this.values.mixnum = mixs[0].mixnum;
  
      this.values.w1_unit = mixs[0].w1_unit;
      this.values.w1_density = mixs[0].w1_density;
      this.values.w2_unit = mixs[0].w2_unit;
      this.values.w2_density = mixs[0].w2_density;
      this.values.w3_unit = mixs[0].w3_unit;
      this.values.w3_density = mixs[0].w3_density;
      this.values.c1_unit = mixs[0].c1_unit;
      this.values.c1_density = mixs[0].c1_density;
      this.values.c2_unit = mixs[0].c2_unit;
      this.values.c2_density = mixs[0].c2_density;
      this.values.c3_unit = mixs[0].c3_unit;
      this.values.c3_density = mixs[0].c3_density;
      this.values.mad1_unit = mixs[0].mad1_unit;
      this.values.mad1_density = mixs[0].mad1_density;
      this.values.mad2_unit = mixs[0].mad2_unit;
      this.values.mad2_density = mixs[0].mad2_density;
      this.values.mad3_unit = mixs[0].mad3_unit;
      this.values.mad3_density = mixs[0].mad3_density;
      this.values.s1_unit = mixs[0].s1_unit;
      this.values.s1_density = mixs[0].s1_density;
      this.values.s2_unit = mixs[0].s2_unit;
      this.values.s2_density = mixs[0].s2_density;
      this.values.s3_unit = mixs[0].s3_unit;
      this.values.s3_density = mixs[0].s3_density;
      this.values.g1_unit = mixs[0].g1_unit;
      this.values.g1_density = mixs[0].g1_density;
      this.values.g2_unit = mixs[0].g2_unit;
      this.values.g2_density = mixs[0].g2_density;
      this.values.g3_unit = mixs[0].g3_unit;
      this.values.g3_density = mixs[0].g3_density;
      this.values.ad1_unit = mixs[0].ad1_unit;
      this.values.ad1_density = mixs[0].ad1_density;
      this.values.ad2_unit = mixs[0].ad2_unit;
      this.values.ad2_density = mixs[0].ad2_density;
      this.values.ad3_unit = mixs[0].ad3_unit;
      this.values.ad3_density = mixs[0].ad3_density;
  
      this.values.mix_volume = mixs[0].volume;

      this.activateroute.params.subscribe((inputs: any) => {
        this.values.input_slump = inputs.slump;
        this.values.input_temp = inputs.temp;
        this.values.input_before = inputs.concrete;
        this.values.input_after = inputs.water;
        this.values.input_i_pressure = inputs.iPressure;
        this.values.input_e_pressure = inputs.ePressure;
    
        this.values.result_mass = this.formula.volumeMass(inputs);
        this.values.result_air = this.formula.airVolume(mixs[0], inputs);
        this.values.result_quantity = this.formula.unitQuantity(mixs[0], inputs);
        
      });
    });

  }


  ngOnDestroy() {
    this.disconnect();
  }

  save() {
    this.postapi.measureResult(this.mixId, this.values).subscribe((res) => {
      this.support.presentToast('저장되었습니다.');
      this.goBack();
    });
  }

  saveAndPrint() {
   const encoder = new EscPosEncoder();
   const result = encoder.initialize();

   result
   .codepage('cp949')
   .start()
   .raw([(this.DS >> 8), (this.DS & 0xff)])
   .line(`${this.values.cname}`)  //사업장
   .line(`${this.values.ct_name}`)  //계약자
   .line(`${this.values.sname}`)  //현장명
   .line(`${this.values.memo}`) //메모
   .line(`${(this.values.datetime).split(/[T.]+/)[0]} ${(this.values.datetime).split(/[T.]+/)[1]}`)  //날짜
   .line(`${this.values.mixnum}`) //배합번호
   .line(NumberStr((this.values.w1_unit).toString(), 6) + NumberStr((this.values.w1_density).toString(), 7))
   .line(NumberStr((this.values.w2_unit).toString(), 6) + NumberStr((this.values.w2_density).toString(), 7))
   .line(NumberStr((this.values.w3_unit).toString(), 6) + NumberStr((this.values.w3_density).toString(), 7))
   .line(NumberStr((this.values.c1_unit).toString(), 6) + NumberStr((this.values.c1_density).toString(), 7))
   .line(NumberStr((this.values.c2_unit).toString(), 6) + NumberStr((this.values.c2_density).toString(), 7))
   .line(NumberStr((this.values.c3_unit).toString(), 6) + NumberStr((this.values.c3_density).toString(), 7))
   .line(NumberStr((this.values.mad1_unit).toString(), 6) + NumberStr((this.values.mad1_density).toString(), 7))
   .line(NumberStr((this.values.mad2_unit).toString(), 6) + NumberStr((this.values.mad2_density).toString(), 7))
   .line(NumberStr((this.values.mad3_unit).toString(), 6) + NumberStr((this.values.mad3_density).toString(), 7))
   .line(NumberStr((this.values.s1_unit).toString(), 6) + NumberStr((this.values.s1_density).toString(), 7))
   .line(NumberStr((this.values.s2_unit).toString(), 6) + NumberStr((this.values.s2_density).toString(), 7))
   .line(NumberStr((this.values.s3_unit).toString(), 6) + NumberStr((this.values.s3_density).toString(), 7))
   .line(NumberStr((this.values.g1_unit).toString(), 6) + NumberStr((this.values.g1_density).toString(), 7))
   .line(NumberStr((this.values.g2_unit).toString(), 6) + NumberStr((this.values.g2_density).toString(), 7))
   .line(NumberStr((this.values.g3_unit).toString(), 6) + NumberStr((this.values.g3_density).toString(), 7))
   .line(NumberStr((this.values.ad1_unit).toString(), 6) + NumberStr((this.values.ad1_density).toString(), 7))
   .line(NumberStr((this.values.ad2_unit).toString(), 6) + NumberStr((this.values.ad2_density).toString(), 7))
   .line(NumberStr((this.values.ad3_unit).toString(), 6) + NumberStr((this.values.ad3_density).toString(), 7))
   .line(NumberStr((this.values.air).toString(), 6)) // 목표공기량
   .line(NumberStr((this.values.aggregate).toString(), 6)) // 골재수정계수
   .line(NumberStr((this.values.wet).toString(), 6)) // 시멘트 습윤밀도
   .line(NumberStr((this.values.common_mass).toString(), 7)) // 용기질량
   .line(NumberStr((this.values.common_water).toString(), 7)) // 용기+물
   .line(NumberStr((this.values.common_volume).toString(), 7)) // 용기용적
   .line(NumberStr((this.values.input_slump).toString(), 7)) // 슬럼프
   .line(NumberStr((this.values.input_temp).toString(), 7)) // 온도
   .line(NumberStr((this.values.input_before).toString(), 7)) // 주수전질량
   .line(NumberStr((this.values.input_after).toString(), 7)) // 주수후질량
   .line(NumberStr((this.values.input_i_pressure).toString(), 7)) // 초기압력
   .line(NumberStr((this.values.input_e_pressure).toString(), 7)) // 평형압력
   .line(NumberStr((this.values.mix_volume).toString(), 7)) // 이론용적
   .line(NumberStr((this.values.result_mass).toString(), 7)) // 단위용적질량
   .line(NumberStr((this.values.result_air).toString(), 7)) // 공기량
   .line(NumberStr((this.values.result_quantity).toString(), 7)) // 단위수량
   .end()

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
            this.presentLoading();
            this.disconnect().then(() => {
              this.bluetooth.deviceConnection(this.printerUUID).then(success => {  
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Printing...',
      duration: 2000
    });
    await loading.present();
  }

  goBack() {
    this.location.back();
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