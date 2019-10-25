import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';

@Component({
  selector: 'app-basic-management',
  templateUrl: './basic-management.component.html',
  styleUrls: ['./basic-management.component.scss']
})
export class BasicManagementComponent implements OnInit {

  DEVICEID = environment.device_id;

  segment = "0";

  companies : any;
  contractors : any;
  sites : any;

  constructor(
    public modalCtrl: ModalController,
    private storage: Storage,
    public getapi: GetApiService,
    private postapi: PostApiService,
  ) { 
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCompany(device).subscribe((res) => {
        this.companies = res;
      });
      this.getapi.getContractor(device).subscribe((res) => {
        this.contractors = res;
      });
      this.getapi.getSite(device).subscribe((res) => {
        this.sites = res;
      });
    });
  }

  ngOnInit() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  delete(id) {
    this.postapi.deleteCompany(id).subscribe((res) => {
      console.log(res);
    })
  }


}
