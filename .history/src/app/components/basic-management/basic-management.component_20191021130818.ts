import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-management',
  templateUrl: './basic-management.component.html',
  styleUrls: ['./basic-management.component.scss']
})
export class BasicManagementComponent implements OnInit {

  segment = "0";

  constructor(
    public modalCtrl: ModalController,

  ) { }

  ngOnInit() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

}
