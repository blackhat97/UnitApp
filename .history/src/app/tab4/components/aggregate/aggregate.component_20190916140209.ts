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

  isConnected = false;

  constructor(
    public modalCtrl: ModalController,
    private bluetooth: BluetoothService,
    private translate: TranslateService,
    private storage: Storage,
    public getapi: GetApiService,

  ) { }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.scaleUUID = res[0].scale_uuid;
        this.airmeterUUID = res[0].airmeter_uuid;
      });
    });
  }

  ngOnInit() {

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

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
