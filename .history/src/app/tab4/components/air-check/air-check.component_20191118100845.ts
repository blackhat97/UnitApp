import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from './../../../../environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { BluetoothService } from 'src/app/providers/providers';

@Component({
  selector: 'app-air-check',
  templateUrl: './air-check.component.html',
  styleUrls: ['./air-check.component.scss']
})
export class AirCheckComponent implements OnInit {

  scaleUUID: string;
  airmeterUUID: string;
  DEVICEID = environment.device_id;

  form: FormGroup;
  footnote: string;

  calc: string;
  value: string = '';
  realtime: string = '0';
  pressure: number[] = [0, 0];
  input1: string = '0';
  private interval = null;
  isConnected = false;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public getapi: GetApiService,
    public formula: FormulaService,
    private bluetooth: BluetoothService
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
    this.form = this.formBuilder.group({
      cWater: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      cValue: [''],
      mValue: [''],
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

  /*
  onChange(ev) {
    let cWater = this.form.controls['cWater'].value;
    this.calc = this.formula.calculationValue(cWater);
  }
  */

  calculator() {
    let cWater = this.form.controls['cWater'].value;
    let iPressure = this.form.controls['iPressure'].value;
    let ePressure = this.form.controls['ePressure'].value;
    
    this.calc = this.formula.calculationValue(cWater);
    this.value = this.formula.measuredValue(iPressure, ePressure);
    
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onEvent(ev) {
    let name = ev.target.name;
    switch(name) {
      case "water":
        this.footnote = "용기+물을 저울에 올리고 적용 버튼을 누르세요.";
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

  requestData() {
    let data = new Uint8Array(3);
    data[0] = 0x02;
    data[1] = 0x20;
    data[2] = 0x03;
    this.bluetooth.dataInOuts(data).then((res) => {
      if(res.length == 22) {
        this.pressure[0] = res.substring(6, 11);
        this.pressure[1] = res.substring(16, 21);
      } else {
        this.realtime = res.replace(/[^0-9]/g,'');
      }
    });
  }

  apply() {
    this.input1 = this.realtime;
  }


}
