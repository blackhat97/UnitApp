import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpandMixComponent } from './../components/expand-mix/expand-mix.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ResultComponent } from '../components/result/result.component';
import { GetApiService } from '../providers/services/get-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  form: FormGroup;

  mixs: any;
  isMix: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public activateroute: ActivatedRoute,
    public getapi: GetApiService,
    private formBuilder: FormBuilder,

  ) {
    
    this.activateroute.params.subscribe((data: any) => {
      if(data.id !== undefined) {
        this.getapi.mixDetails(data.id).subscribe((res: any) => {
          this.mixs = res;
          this.isMix = true;
        });
      }
    });

    this.form = this.formBuilder.group({
      slump: ['', [Validators.required]],
      temp: ['', [Validators.required]],
      concrete: ['', [Validators.required]],
      water: ['', [Validators.required]],
      iPressure: ['', [Validators.required]],
      ePressure: ['', [Validators.required]],
    });
  }


  async presentResult() {
    const modal = await this.modalCtrl.create({
      component: ResultComponent,
      componentProps: { value: this.form.value, mix: this.mixs }
    });
    console.log(this.mixs);
    await modal.present();
  }
  
  async presentExpand() {
    const modal = await this.modalCtrl.create({
      component: ExpandMixComponent,
      componentProps: { mixid: this.mixs[0].id }
    });
    await modal.present();
  }

}
