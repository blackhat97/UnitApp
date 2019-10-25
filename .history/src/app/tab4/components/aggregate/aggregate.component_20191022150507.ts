import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { GetApiService } from 'src/app/providers/services/get-api.service';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss']
})
export class AggregateComponent implements OnInit {

  budget: string;
  footnote: string;
  DEVICEID = environment.device_id;
  scaleUUID: string;
  airmeterUUID: string;
  pressure: number[] = [0, 0];
  realtime: string = '0';
  aggregate1 : string = '0';
  aggregate2 : string = '0';

  isConnected = false;
  private interval = null;
  form: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    private bluetooth: BluetoothService,
    private translate: TranslateService,
    private storage: Storage,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,
  ) { }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.scaleUUID = res[0].scale_uuid;
        this.airmeterUUID = res[0].airmeter_uuid;
      });
    });
  }

  ngAfterViewInit() {
    
    this.interval = setInterval(() => {      
      this.requestData();
    }, 1*1000);
    
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      cWater: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      cValue: [''],
      mValue: [''],
    });
  }

  onEvent(ev) {
    let name = ev.target.name;
    switch (name) {
      case "aggregate1":
        this.footnote = "용기+골재를 저울에 올리고 적용 버튼을 누르세요.";
        this.checkConnection(this.scaleUUID);
        break;
      case "aggregate2":
        this.footnote = "용기+골재+물을 저울에 올리고 적용 버튼을 누르세요.";
        this.checkConnection(this.scaleUUID);
        break;
      case "iPressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        this.checkConnection(this.airmeterUUID);
        break;
      case "ePressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        this.checkConnection(this.airmeterUUID);
        break;
      default: 
        this.footnote = "메시지 없음";
    }
  }

  checkConnection(seleccion) {
    this.disconnect().then(() => {
      this.bluetooth.deviceConnection(seleccion).then(success => {                  
        this.isConnected = true;
      }, fail => {
        this.isConnected = false;
      });
    });
  }

  requestData() {
    let data = new Uint8Array(3);
    data[0] = 0x02;
    data[1] = 0x20;
    data[2] = 0x03;
    this.bluetooth.dataInOuts(data).then((res) => {
      if(res.length == 22) {
        this.pressure[0] = res.substring(0, 11);
        this.pressure[1] = res.substring(11, 21);
      } else {
        this.realtime = res.replace(/[^0-9]/g,'');
      }
    });
  }

  apply() {
    this.aggregate1 = this.realtime;
  }

  apply2() {
    this.aggregate2 = this.realtime;
  }
  

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }

  ionViewWillLeave(){
    clearInterval(this.interval);
  }


  calculator() {

    // (골재질량) / (골재용적 - (골재용적 * air / 100))
    const o34 =  0;//골재잘량
    const o33 =  0;//골재용적
  }


  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
