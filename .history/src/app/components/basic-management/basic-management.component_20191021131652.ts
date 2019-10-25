import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from 'src/app/providers/services/get-api.service';

@Component({
  selector: 'app-basic-management',
  templateUrl: './basic-management.component.html',
  styleUrls: ['./basic-management.component.scss']
})
export class BasicManagementComponent implements OnInit {

  DEVICEID = environment.device_id;

  segment = "0";

  constructor(
    public modalCtrl: ModalController,
    private storage: Storage,
    public getapi: GetApiService,

  ) { 
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCompany(device).subscribe((res) => {
        console.log(res);
      });
    });
  }

  ngOnInit() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  

}
