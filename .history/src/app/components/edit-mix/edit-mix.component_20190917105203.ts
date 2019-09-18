import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-edit-mix',
  templateUrl: './edit-mix.component.html',
  styleUrls: ['./edit-mix.component.scss']
})
export class EditMixComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
  ) { }

  ngOnInit() {
  }
  

}
