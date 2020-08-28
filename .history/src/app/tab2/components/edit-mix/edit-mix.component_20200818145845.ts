import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { Router } from '@angular/router';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { FormulaService } from 'src/app/providers/services/formula.service';

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
    public alertCtrl: AlertController,
    public formula: FormulaService

  ) { }

  ngOnInit() {
    this.mixid = this.navParams.get('mixid'); // this.navParams.data.excludedTracks;
    this.getapi.mixElement(this.mixid).subscribe((res: any) => {
      this.elements = res;

      this.form = this.formBuilder.group({
        
        ad1_density: new FormControl(res[0].ad1_density),
        ad1_unit: new FormControl(res[0].ad1_unit),
        ad2_density: new FormControl(res[0].ad2_density),
        ad2_unit: new FormControl(res[0].ad2_unit),
        ad3_density: new FormControl(res[0].ad3_density),
        ad3_unit: new FormControl(res[0].ad3_unit),
        c1_density: new FormControl(res[0].c1_density),
        c1_unit: new FormControl(res[0].c1_unit),
        c2_density: new FormControl(res[0].c2_density),
        c2_unit: new FormControl(res[0].c2_unit),
        c3_density: new FormControl(res[0].c3_density),
        c3_unit: new FormControl(res[0].c3_unit),
        g1_density: new FormControl(res[0].g1_density),
        g1_unit: new FormControl(res[0].g1_unit),
        g2_density: new FormControl(res[0].g2_density),
        g2_unit: new FormControl(res[0].g2_unit),
        g3_density: new FormControl(res[0].g3_density),
        g3_unit: new FormControl(res[0].g3_unit),
        mad1_density: new FormControl(res[0].mad1_density),
        mad1_unit: new FormControl(res[0].mad1_unit),
        mad2_density: new FormControl(res[0].mad2_density),
        mad2_unit: new FormControl(res[0].mad2_unit),
        mad3_density: new FormControl(res[0].mad3_density),
        mad3_unit: new FormControl(res[0].mad3_unit),
        s1_density: new FormControl(res[0].s1_density),
        s1_unit: new FormControl(res[0].s1_unit),
        s2_density: new FormControl(res[0].s2_density),
        s2_unit: new FormControl(res[0].s2_unit),
        s3_density: new FormControl(res[0].s3_density),
        s3_unit: new FormControl(res[0].s3_unit),
        w1_density: new FormControl(res[0].w1_density),
        w1_unit: new FormControl(res[0].w1_unit),
        w2_density: new FormControl(res[0].w2_density),
        w2_unit: new FormControl(res[0].w2_unit),
        w3_density: new FormControl(res[0].w3_density),
        w3_unit: new FormControl(res[0].w3_unit),

        volume: new FormControl(res[0].volume),
        aggregate: new FormControl(res[0].aggregate),
        air: new FormControl(res[0].air),
        wet: new FormControl(res[0].wet),
      });

    });
  }

  async moveMeasure() {
    this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: MeasureComponent,
      componentProps: { id: this.mixid }
    });
    await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async update() {
    const alert = await this.alertCtrl.create({
      header: '배합 업데이트',
      message: '해당배합을 업데이트 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: _ => {
            this.postapi.updateMix(this.mixid, this.form.value)
            .subscribe(
              res => {
                this.support.presentToast('변경되었습니다');
              }
            );
          }
        }
      ],
    });
    await alert.present();
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: '배합삭제',
      message: '해당배합을 삭제 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: _ => {
            this.postapi.deleteMix(this.mixid)
            .subscribe(
              res => {
                this.dismiss();
                this.support.presentToast('삭제되었습니다.');
              }
            );
          }
        }
      ],
    });
    await alert.present();
  }


  change() {
    const air = this.form.controls['air'].value;
    this.elements[0].wet = this.formula.cementWet(this.form.value);
    this.elements[0].volume = this.formula.theoryVolume(this.form.value, air);
  }

  

  

}
