import { EditMixComponent } from './../../components/edit-mix/edit-mix.component';
import { ModalController } from '@ionic/angular';
import { FavoriteService } from './../../providers/services/favorite.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GetApiService } from 'src/app/providers/services/get-api.service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage';
import { PostApiService } from 'src/app/providers/services/post-api.service';

@Component({
  selector: 'app-mix-list',
  templateUrl: './mix-list.page.html',
  styleUrls: ['./mix-list.page.scss'],
})
export class MixListPage implements OnInit {

  DEVICEID = environment.device_id;
  mixs: any;
  isFavorite: boolean[] = [];

  constructor(
    public getapi: GetApiService,
    private storage: Storage,
    public router: Router,
    private favorite: FavoriteService,
    public modalCtrl: ModalController,
    private postapi: PostApiService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get(this.DEVICEID).then(device => {
      this.getapi.mixList(device).subscribe((res) => {
        this.mixs = res;
      });

    });
  }

  toggleFavorite(id, bool) {

    this.postapi.updateFavorte(id, bool).subscribe((res) => {
      console.log(res);
    });

    /*
    if (this.favorite.hasFavorite(id)) {
      this.favorite.removeFavorite(id);
      this.isFavorite = false;
    } else {
      this.favorite.addFavorite(id);
      this.isFavorite = true;
    }
    */
  }

  async presentEditMix(id) {
    const modal = await this.modalCtrl.create({
      component: EditMixComponent,
      componentProps: { mixid: id }
    });
    await modal.present();
  }

  movetab2(id) {
    this.router.navigate( [`/tabs/tab2`, {id: id}]);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      
    }, 500);
  }

}
