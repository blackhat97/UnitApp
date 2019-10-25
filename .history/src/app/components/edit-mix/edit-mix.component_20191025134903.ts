import { FormGroup, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Router } from '@angular/router';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { SupportService } from 'src/app/providers/services/support.service';

@Component({
  selector: 'app-edit-mix',
  templateUrl: './edit-mix.component.html',
  styleUrls: ['./edit-mix.component.scss']
})
export class EditMixComponent implements OnInit {

  DEVICEID = environment.device_id;
  form: FormGroup;

  elements: any;
  mixid: string;

  constructor(
    private storage: Storage,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public getapi: GetApiService,
    public router: Router,
    private postapi: PostApiService,
    public support:SupportService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
    this.getapi.mixElement(this.mixid).subscribe((res: any) => {
      this.elements = res;
    });

    this.form = this.formBuilder.group({
      w1_unit: [''],
      w1_density: [''],
    });
  }

  movetab2() {
    this.modalCtrl.dismiss();
    this.router.navigate( [`/tabs/tab2`, {id: this.mixid}]);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  update() {
    console.log(this.form.value);
    
/*
    this.storage.get(this.DEVICEID).then(deviceId => {
      this.postapi.updateMix(deviceId, this.form.value)
      .subscribe(
        res => {
          this.support.presentToast('변경되었습니다');
        }
      );
    }); 
*/

  }
  

}
