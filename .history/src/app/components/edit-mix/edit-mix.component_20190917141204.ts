import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-mix',
  templateUrl: './edit-mix.component.html',
  styleUrls: ['./edit-mix.component.scss']
})
export class EditMixComponent implements OnInit {

  elements: any;
  mixid: string;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public getapi: GetApiService,
    public router: Router,

  ) { }

  ngOnInit() {
    this.mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
    this.getapi.mixElement(this.mixid).subscribe((res: any) => {
      this.elements = res;
    });
  }

  movetab2() {
    this.modalCtrl.dismiss();
    this.router.navigate( [`/tabs/tab2`, {id: this.mixid}]);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  

}
