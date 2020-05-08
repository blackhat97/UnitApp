import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BluetoothService } from 'src/app/providers/providers';
import { Storage } from '@ionic/storage';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.scss']
})
export class AggregateComponent implements OnInit {
  @ViewChild('modelInput1', {static: false}) modelInput1;
  @ViewChild('modelInput2', {static: false}) modelInput2;
  @ViewChild('modelInput3', {static: false}) modelInput3;

  footnote: string;
  DEVICEID = environment.device_id;
  scaleUUID: string;
  airmeterUUID: string;
  pressure: number[] = [0, 0];
  inputs: string[] = ['0', '0'];
  realtime: string = '0';

  isConnected = false;
  private interval = null;
  form: FormGroup;
  value: string = '';

  constructor(
    public modalCtrl: ModalController,
    private bluetooth: BluetoothService,
    private storage: Storage,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,
    public formula: FormulaService

  ) { }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.scaleUUID = res[0].scale_uuid;
        this.airmeterUUID = res[0].airmeter_uuid;
      });
    });

    this.modelInput1.setFocus();

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      aggregate: ['', [Validators.required]],
      water: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
    });

  }

  ngAfterViewInit() {
    this.interval = setInterval(() => {      
      this.requestData();
    }, 1*1000);
  }

  ionViewWillLeave(){
    clearInterval(this.interval);
   
  }

  ngOnDestroy() {
    this.disconnect();
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
    this.bluetooth.dataInOutRealtime(data).then((res) => {
      if(res.length == 22) {
        //this.pressure[0] = res.substring(0, 11);
        this.pressure[0] = res.substring(6, 11);
        //this.pressure[1] = res.substring(11, 21);
        this.pressure[1] = res.substring(16, 21);
      } else {
        this.realtime = res.replace(/[^0-9]/g,'');
      }
    });
  }

  apply() {
    this.inputs[0] = this.realtime;
    this.modelInput2.setFocus();

  }

  apply2() {
    this.inputs[1] = this.realtime;

    this.modelInput3.setFocus();

  }
  

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }

  calculator() {
    let aggregate = this.form.controls['aggregate'].value;
    let water = this.form.controls['water'].value;
    let iPressure = this.form.controls['iPressure'].value;
    let ePressure = this.form.controls['ePressure'].value;

    this.value = this.formula.aggregateDensity(aggregate, water, iPressure, ePressure);

  }


  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
