import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormulaService } from 'src/app/providers/services/formula.service';

@Component({
  selector: 'app-air',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit {

  form: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    public formula: FormulaService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      concrete: ['', [Validators.required]],
      water: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
      coefficient: ['', [Validators.required]],
    });
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

  calculator() {

  }
}
