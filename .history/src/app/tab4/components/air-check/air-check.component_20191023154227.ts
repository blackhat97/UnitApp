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
  footnote: string;

  calc: string;
  value: string = '';
  //common: number[] = [];

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
        this.footnote = "용기+골재를 저울에 올리고 적용 버튼을 누르세요.";
        break;
      case "iPressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        break;
      case "ePressure":
        this.footnote = "공기량 시험이 끝나면 측정 버튼을 누르세요.";
        break;
    }

  }

}
