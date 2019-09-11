import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mix-list',
  templateUrl: './mix-list.page.html',
  styleUrls: ['./mix-list.page.scss'],
})
export class MixListPage implements OnInit {

  DEVICEID = environment.device_id;
  mixs: any;

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    public router: Router,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.mixList(device).subscribe((res) => {
        this.mixs = res;
      });
    });
  }

  movetab2(id) {
    this.router.navigate( [`/tabs/tab2`, {id: id}]);
  }

}
