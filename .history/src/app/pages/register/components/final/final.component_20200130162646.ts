import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormData } from 'src/app/providers/models/formData.model';
import { FormDataService } from 'src/app/providers/services/formData.service';
import { SupportService } from 'src/app/providers/services/support.service';
import { PostApiService } from 'src/app/providers/services/post-api.service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.scss']
})
export class FinalComponent implements OnInit {


  @Input() formData: FormData;
  isFormValid: boolean = false;
  DEVICEID = environment.device_id;
  volume = 0;

  constructor(
    private router: Router,
    private formDataService: FormDataService,
    public support:SupportService,
    private postapi: PostApiService,
    private storage: Storage,
    public alertCtrl: AlertController,
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.formData = this.formDataService.getFormData();
    if (this.formData.w1_density == "" && this.formData.w2_density == "" && this.formData.w3_density == "") {
      this.formData.w1_density = "1";
    }
    
    this.volume = Number(this.formData.volume);
    this.isFormValid = this.formDataService.isFormValid();
  }

  goToPrevious() {
    this.router.navigate(['/app/register/percentage']);
  }

  submit() {
    //console.log(JSON.stringify(this.formData));

    this.storage.get(this.DEVICEID).then(device => {
      this.postapi.insertRegisterMix(device, this.formData).subscribe((res: any) => {
          this.support.presentToast('등록되었습니다.');
          this.formData = this.formDataService.resetFormData();
          this.isFormValid = false;
          this.navCtrl.navigateRoot('/app/mix-list');
      });
    });
  }

  async checkConfirm() {
    const alert = await this.alertCtrl.create({
      header: '배합등록',
      message: '배합등록을 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          role: 'submit',
          handler: _ => {
            this.submit();        
          }
        }
      ],
    });
    await alert.present();
  }

}
