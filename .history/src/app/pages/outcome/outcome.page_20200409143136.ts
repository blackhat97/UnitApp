import { environment } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { BluetoothService } from 'src/app/providers/providers';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.page.html',
  styleUrls: ['./outcome.page.scss'],
})
export class OutcomePage implements OnInit {
  //public navParams = new NavParams;

  DEVICEID = environment.device_id;
  printerUUID: string;

  isConnected = false;
  mixId: string = '';
  values = {};
  
  constructor(
    private location: Location,
    public postapi: PostApiService,
    public formula: FormulaService,
    public getapi: GetApiService,
    public support:SupportService,
    private bluetooth: BluetoothService,
    public activateroute: ActivatedRoute,
    private storage: Storage,

  ) { 
    
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.getCommon(device).subscribe((res) => {
        console.log(res);
        /*
        this.values.common_mass = res[0].mass;
        this.values.common_water = res[0].water;
        this.values.common_volume = res[0].volume;
        */
      });
    });

  }

  ionViewDidEnter(){
    this.mixId = this.activateroute.snapshot.paramMap.get('id');

    this.activateroute.params.subscribe((data: any) => {
      console.log(data);
    });
    
  }

  ngOnInit() {
    

  }


  save() {
    this.postapi.measureResult(this.mixId, this.values).subscribe((res) => {
      this.support.presentToast('저장되었습니다.');
      this.goBack();
    });
  }

  saveAndPrint() {
  }

  goBack() {
    this.location.back();
  }

}
