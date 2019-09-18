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

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public getapi: GetApiService,
    public router: Router,

  ) { }

  ngOnInit() {
    const mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
    this.getapi.mixElement(mixid).subscribe((res: any) => {
      this.elements = res;
      console.log(res);
    });

  }

  movetab2(id) {
    this.router.navigate( [`/tabs/tab2`, {id: id}]);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  

}
