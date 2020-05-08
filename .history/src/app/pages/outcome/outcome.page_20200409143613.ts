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
  values = {
    cname: '',
    sname: '',
    ct_name: '',
    mixnum: '',
    w1_unit: 0,
    w1_density: 0,
    w2_unit: 0,
    w2_density: 0,
    w3_unit: 0,
    w3_density: 0,
    c1_unit: 0,
    c1_density: 0,
    c2_unit: 0,
    c2_density: 0,
    c3_unit: 0,
    c3_density: 0,
    mad1_unit: 0,
    mad1_density: 0,
    mad2_unit: 0,
    mad2_density: 0,
    mad3_unit: 0,
    mad3_density: 0,
    s1_unit: 0,
    s1_density: 0,
    s2_unit: 0,
    s2_density: 0,
    s3_unit: 0,
    s3_density: 0,
    g1_unit: 0,
    g1_density: 0,
    g2_unit: 0,
    g2_density: 0,
    g3_unit: 0,
    g3_density: 0,
    ad1_unit: 0,
    ad1_density: 0,
    ad2_unit: 0,
    ad2_density: 0,
    ad3_unit: 0,
    ad3_density: 0,

    common_mass: 0,
    common_water: 0,
    common_volume: 0,
    input_slump: 0,
    input_temp: 0,
    input_before: 0,
    input_after: 0,
    input_i_pressure: 0,
    input_e_pressure: 0,
    mix_volume: 0,
    mass : '',
    air : '',
    quantity : '',
    memo : '',
  };

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
        this.values.common_mass = res[0].mass;
        this.values.common_water = res[0].water;
        this.values.common_volume = res[0].volume;
      });
    });

  }

  ngOnInit() {
    this.mixId = this.activateroute.snapshot.paramMap.get('id');
    this.getapi.mixElement(this.mixId).subscribe((res: any) => {
      console.log(res);
    });
    this.activateroute.params.subscribe((inputs: any) => {
      console.log(inputs);
    }); 
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
