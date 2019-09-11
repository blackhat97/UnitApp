import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-complete-list',
  templateUrl: './complete-list.page.html',
  styleUrls: ['./complete-list.page.scss'],
})
export class CompleteListPage implements OnInit {

  DEVICEID = environment.device_id;
  queryText = '';
  results: any;
  
  constructor(
    public getapi: GetApiService,
    private storage: Storage,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.completeList(device).subscribe((res) => {
        this.results = res;
      });
    });
  }

  updateList(ev) {

  }

}
