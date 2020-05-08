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

  constructor(
    private location: Location,
    public postapi: PostApiService,
    public formula: FormulaService,
    public getapi: GetApiService,
    public support:SupportService,
    private bluetooth: BluetoothService,
    public activateroute: ActivatedRoute,
    
  ) { 

  }

  ionViewDidEnter(){
    this.activateroute.params.subscribe((data: any) => {
      console.log(data);
    });
    
  }

  ngOnInit() {
    

  }


  save() {

  }

  saveAndPrint() {
  }

  goBack() {
    this.location.back();
  }

}
