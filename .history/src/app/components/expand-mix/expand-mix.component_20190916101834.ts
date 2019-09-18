import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expand-mix',
  templateUrl: './expand-mix.component.html',
  styleUrls: ['./expand-mix.component.scss']
})
export class ExpandMixComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,

  ) { }

  ngOnInit() {
      const mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
      console.log(mixid);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
