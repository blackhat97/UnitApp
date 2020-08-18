import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { BluetoothService } from 'src/app/providers/providers';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-air',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit {
  @ViewChild('modelInput2', {static: false}) modelInput2;
  @ViewChild('modelInput3', {static: false}) modelInput3;

  DEVICEID = environment.device_id;
  scaleUUID: string;
  airmeterUUID: string;

  form: FormGroup;
  value: string = '';
  footnote: string;
  realtime: string = '0';
  pressure: number[] = [0, 0];
  inputs: string[] = ['0', '0'];
  
  isConnected = false;
  private interval = null;

  constructor(
    public modalCtrl: ModalController,
    public formula: FormulaService,
    private formBuilder: FormBuilder,
    private bluetooth: BluetoothService,
    private storage: Storage,
    public getapi: GetApiService,
    private translate: TranslateService,

  ) { }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.bluetoothUUID(device).subscribe((res) => {
        this.scaleUUID = res[0].scale_uuid;
        this.airmeterUUID = res[0].airmeter_uuid;

        this.checkConnection(this.scaleUUID);
        
      });
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      concrete: ['', [Validators.required]],
      water: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      coefficient: ['', [Validators.required]],
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


  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }


  calculator() {
    let concrete = this.form.controls['concrete'].value;
    let water = this.form.controls['water'].value;
    let iPressure = this.form.controls['iPressure'].value;
    let ePressure = this.form.controls['ePressure'].value;
    let coefficient = this.form.controls['coefficient'].value;

    this.value = this.formula.air(concrete, water, iPressure, ePressure, coefficient);
  }

  onEvent(ev) {
    let name = ev.target.name;
    switch(name) {
      case "concrete":
        this.footnote = "용기+콘크리트를 저울에 올리고 적용 버튼을 누르세요.";
        //this.checkConnection(this.scaleUUID);
        break;
      case "water":
        this.footnote = "용기+콘크리트+물을 저울에 올리고 적용 버튼을 누르세요.";
        //this.checkConnection(this.scaleUUID);
        break;
      case "iPressure":
        this.footnote = this.translate.instant('TAB4.APPLY_BUTTON_2');
        this.checkConnection(this.airmeterUUID);
        break;
      case "ePressure":
        this.footnote = this.translate.instant('TAB4.APPLY_BUTTON_3');
        this.checkConnection(this.airmeterUUID);
        break;
      default: 
        this.footnote = this.translate.instant('TAB4.NO_MESSAGE');
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
    this.bluetooth.dataInOutRealtime(data).then((res) => {
      if(res.length == 22) {
        this.pressure[0] = res.substring(6, 11);
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

}
