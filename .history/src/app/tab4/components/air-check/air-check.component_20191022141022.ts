import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from './../../../../environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { FormulaService } from 'src/app/providers/services/formula.service';

@Component({
  selector: 'app-air-check',
  templateUrl: './air-check.component.html',
  styleUrls: ['./air-check.component.scss']
})
export class AirCheckComponent implements OnInit {

  form: FormGroup;

  calc: string;
  value: string = '';
  //common: number[] = [];

  DEVICEID = environment.device_id;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public getapi: GetApiService,
    public formula: FormulaService
  ) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      cWater: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      cValue: [''],
      mValue: [''],
    });
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
    let cValue = this.form.controls['cValue'].value;
    
    //let value = (((iPressure - ePressure) * this.commons.air_volume) / ePressure) / (this.commons.water - this.commons.mass) * 100 - this.commons.pz;
    this.calc = this.formula.calculationValue(cWater);
    this.value = this.formula.measuredValue(iPressure, ePressure);
    
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
