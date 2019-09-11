import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-air-check',
  templateUrl: './air-check.component.html',
  styleUrls: ['./air-check.component.scss']
})
export class AirCheckComponent implements OnInit {

  form: FormGroup;

  value: number = 0;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  calc() {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
