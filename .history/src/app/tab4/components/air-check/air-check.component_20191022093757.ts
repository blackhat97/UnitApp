import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from './../../../../environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-air-check',
  templateUrl: './air-check.component.html',
  styleUrls: ['./air-check.component.scss']
})
export class AirCheckComponent implements OnInit {

  form: FormGroup;

  calc: string;
  value: number = 0;
  common: number[] = [];
  commons = {
    mass: 0,
    water: 0,
    volume: 0,
    air_volume: 0,
    pz: 0
  };

  DEVICEID = environment.device_id;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public getapi: GetApiService,
  ) { }

  ionViewDidEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCommon(device).subscribe((res) => {
        this.commons.volume = res[0].volume;
        this.common = [res[0].mass, res[0].water];
      });
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      cWater: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      cValue: ['', [Validators.required]],

    });
  }

  onChange(ev) {
    let cWater = this.form.controls['cWater'].value;
    let l16 = (this.common[1] - this.common[0]);
    this.calc = ((l16-(cWater - this.common[0]))/l16*100).toFixed(2);
    
  }

  calculator() {
    let cWater = this.form.controls['cWater'].value;
    let iPressure = this.form.controls['iPressure'].value;
    let ePressure = this.form.controls['ePressure'].value;
    let cValue = this.form.controls['cValue'].value;
    console.log(this.commons.volume);
    //(iPressure - ePressure)*

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
