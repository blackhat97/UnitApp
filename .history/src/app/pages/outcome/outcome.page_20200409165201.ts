import { environment } from 'src/environments/environment.prod';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { FormulaService } from 'src/app/providers/services/formula.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { BluetoothService } from 'src/app/providers/providers';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParams, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.page.html',
  styleUrls: ['./outcome.page.scss'],
})
export class OutcomePage implements OnInit {
  //public navParams = new NavParams;

  DEVICEID = environment.device_id;  

  mixId: string = '';
  values = {
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
    public activateroute: ActivatedRoute,
    private storage: Storage,
    public router: Router,

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
    this.getapi.mixElement(this.mixId).subscribe((mixs: any) => {
      this.values.mixnum = mixs[0].mixnum;
  
      this.values.w1_unit = mixs[0].w1_unit;
      this.values.w1_density = mixs[0].w1_density;
      this.values.w2_unit = mixs[0].w2_unit;
      this.values.w2_density = mixs[0].w2_density;
      this.values.w3_unit = mixs[0].w3_unit;
      this.values.w3_density = mixs[0].w3_density;
      this.values.c1_unit = mixs[0].c1_unit;
      this.values.c1_density = mixs[0].c1_density;
      this.values.c2_unit = mixs[0].c2_unit;
      this.values.c2_density = mixs[0].c2_density;
      this.values.c3_unit = mixs[0].c3_unit;
      this.values.c3_density = mixs[0].c3_density;
      this.values.mad1_unit = mixs[0].mad1_unit;
      this.values.mad1_density = mixs[0].mad1_density;
      this.values.mad2_unit = mixs[0].mad2_unit;
      this.values.mad2_density = mixs[0].mad2_density;
      this.values.mad3_unit = mixs[0].mad3_unit;
      this.values.mad3_density = mixs[0].mad3_density;
      this.values.s1_unit = mixs[0].s1_unit;
      this.values.s1_density = mixs[0].s1_density;
      this.values.s2_unit = mixs[0].s2_unit;
      this.values.s2_density = mixs[0].s2_density;
      this.values.s3_unit = mixs[0].s3_unit;
      this.values.s3_density = mixs[0].s3_density;
      this.values.g1_unit = mixs[0].g1_unit;
      this.values.g1_density = mixs[0].g1_density;
      this.values.g2_unit = mixs[0].g2_unit;
      this.values.g2_density = mixs[0].g2_density;
      this.values.g3_unit = mixs[0].g3_unit;
      this.values.g3_density = mixs[0].g3_density;
      this.values.ad1_unit = mixs[0].ad1_unit;
      this.values.ad1_density = mixs[0].ad1_density;
      this.values.ad2_unit = mixs[0].ad2_unit;
      this.values.ad2_density = mixs[0].ad2_density;
      this.values.ad3_unit = mixs[0].ad3_unit;
      this.values.ad3_density = mixs[0].ad3_density;
  
      this.values.mix_volume = mixs[0].volume;

      this.activateroute.params.subscribe((inputs: any) => {
        this.values.input_slump = inputs.slump;
        this.values.input_temp = inputs.temp;
        this.values.input_before = inputs.concrete;
        this.values.input_after = inputs.water;
        this.values.input_i_pressure = inputs.iPressure;
        this.values.input_e_pressure = inputs.ePressure;
    
        this.values.mass = this.formula.volumeMass(inputs);
        this.values.air = this.formula.airVolume(mixs[0], inputs);
        this.values.quantity = this.formula.unitQuantity(mixs[0], inputs);
        
      });
    });

  }

  save() {
    this.postapi.measureResult(this.mixId, this.values).subscribe((res) => {
      this.support.presentToast('저장되었습니다.');
      this.goBack();
    });
  }

  saveAndPrint() {
    this.postapi.measureResult(this.mixId, this.values).subscribe((res) => {
      this.support.presentToast('저장되었습니다.');
      console.log(res[0]);
      
      this.router.navigate( [`/app/details/${res[0].id}`]);

    });
  }

  goBack() {
    this.location.back();
  }

}

