import { AirCheckComponent } from './components/air-check/air-check.component';
import { AirComponent } from './components/air/air.component';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(
    public modalCtrl: ModalController,

  ) { }

  ngOnInit() {
  }

  async presentAggregate() {
    const modal = await this.modalCtrl.create({
      component: AggregateComponent,
    });
    await modal.present();
  }

  async presentAir() {
    const modal = await this.modalCtrl.create({
      component: AirComponent,
    });
    await modal.present();
  }

  async presentAirCheck() {
    const modal = await this.modalCtrl.create({
      component: AirCheckComponent,
    });
    await modal.present();
  }

}
