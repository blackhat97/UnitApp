import { EditMixComponent } from '../edit-mix/edit-mix.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage';
import { PostApiService } from 'src/app/providers/services/post-api.service';

@Component({
  selector: 'app-mix-list',
  templateUrl: './mix-list.component.html',
  styleUrls: ['./mix-list.component.scss']
})
export class MixListComponent implements OnInit {

  DEVICEID = environment.device_id;
  mixs: any;
  page = 0;

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    public router: Router,
    public modalMix: ModalController,
    private postapi: PostApiService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.mixList(device, this.page).subscribe((res) => {
        this.mixs = res;
      });
    });
  }

  toggleFavorite(id, favorite) {
    let data = {bool: !favorite};
    this.storage.get(this.DEVICEID).then(device => {
      this.postapi.updateFavorte(id, data).subscribe((_) => {
        this.getapi.mixList(device, this.page).subscribe((res) => {
          this.mixs = res;
        });
      });
    });
  }

  async presentEditMix(id) {
    const modal = await this.modalMix.create({
      component: EditMixComponent,
      componentProps: { mixid: id }
    });
    modal.onDidDismiss().then((modalData) => {
      this.page = 0;
      this.storage.get(this.DEVICEID).then(device => {
        this.getapi.mixList(device, this.page).subscribe((res) => {
          this.mixs = res;
        });
      });
    });
    await modal.present();
  }

  pushData() {
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.mixList(device, this.page).subscribe((res) => {
        res.forEach(element => {
          this.mixs.push(element);
        });
      });
    });
  }

  loadData(event) {
    setTimeout(() => {
      this.page++;
      this.pushData();
      event.target.complete();
    }, 500);
  }

}
