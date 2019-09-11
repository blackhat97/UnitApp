import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-air-check',
  templateUrl: './air-check.component.html',
  styleUrls: ['./air-check.component.scss']
})
export class AirCheckComponent implements OnInit {

  value: number = 0;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  }

  calc() {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
