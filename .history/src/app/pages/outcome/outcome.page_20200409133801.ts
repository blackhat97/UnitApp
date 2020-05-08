import { environment } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { BluetoothService } from 'src/app/providers/providers';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.page.html',
  styleUrls: ['./outcome.page.scss'],
})
export class OutcomePage implements OnInit {

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
    private navCtrl: NavController,

  ) { 

  }

  ngOnInit() {
    
  }


  save() {

  }

  saveAndPrint() {
  }

  goBack() {
    //this.navCtrl.navigateForward('/app/outcome');
    this.location.back();

  }

}
