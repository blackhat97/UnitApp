import { environment } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { NavParams } from '@ionic/angular';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { BluetoothService } from 'src/app/providers/providers';

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
    public postapi: PostApiService,
    public navParams: NavParams,
    public formula: FormulaService,
    public getapi: GetApiService,
    public support:SupportService,
    private bluetooth: BluetoothService
  ) { 

  }

  ngOnInit() {
    
  }


  save() {

  }

  saveAndPrint() {
  }

}
