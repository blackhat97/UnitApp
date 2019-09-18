import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';

@Component({
  selector: 'app-expand-mix',
  templateUrl: './expand-mix.component.html',
  styleUrls: ['./expand-mix.component.scss']
})
export class ExpandMixComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public getapi: GetApiService,

  ) { }

  ngOnInit() {
      const mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
      this.getapi.mixElement(mixid).subscribe((res: any) => {
        console.log(res);
      });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
