import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpandMixComponent } from './../components/expand-mix/expand-mix.component';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultComponent } from '../components/result/result.component';
import { GetApiService } from '../providers/services/get-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportService } from '../providers/services/support.service';
import { BluetoothService } from '../providers/providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  @ViewChild('modelInput2', {static: false}) modelInput2;
  @ViewChild('modelInput3', {static: false}) modelInput3;

  DEVICEID = environment.device_id;
  scaleUUID: string;
  airmeterUUID: string;

  form: FormGroup;

  mixs: any;
  isMix: boolean = false;
  realtime: string = '0';
  pressure: number[] = [0, 0];
  inputs: string[] = ['0', '0'];

  isConnected = false;
  private interval = null;

  constructor(
    public modalCtrl: ModalController,
    public activateroute: ActivatedRoute,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,
    public support: SupportService,
    private bluetooth: BluetoothService,
    private storage: Storage,
    private navCtrl: NavController,
  ) {
    
    this.activateroute.params.subscribe((data: any) => {
      if(data.id !== undefined) {
        this.getapi.mixDetails(data.id).subscribe((res: any) => {
          this.mixs = res;
          this.isMix = true;
        });
      }
    });
  }

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
      slump: [''],
      temp: [''],
      concrete: ['', [Validators.required]],
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

  async presentResult() {
    const modal = await this.modalCtrl.create({
      component: ResultComponent,
      componentProps: { inputs: this.form.value, mixs: this.mixs }
    });
    await modal.present();
  }

  goOutcome() {
    console.log(this.form.value);
    this.navCtrl.navigateForward(['/app/outcome', this.form.value]);
    
  }
  
  async presentExpand() {
    const modal = await this.modalCtrl.create({
      component: ExpandMixComponent,
      componentProps: { mixid: this.mixs[0].id }
    });
    await modal.present();
  }

  chooseAlert() {
    this.support.showAlert("배합등록을 먼저 선택해주세요.");
  }

  apply() {
    this.inputs[0] = this.realtime;
    this.modelInput2.setFocus();
  }

  apply2() {
    this.inputs[1] = this.realtime;
    this.modelInput3.setFocus();
  }

  onEvent(ev) {
    let name = ev.target.name;
    switch(name) {
      case "concrete":
        this.checkConnection(this.scaleUUID);
        break;
      case "water":
        this.checkConnection(this.scaleUUID);
        break;
      case "iPressure":
        this.checkConnection(this.airmeterUUID);
        break;
      case "ePressure":
        this.checkConnection(this.airmeterUUID);
        break;
      default: 
        this.disconnect().then(() => {
          console.log('disconnect bluetooth');
        });
    }

  }

}
