import { Component, ViewChild } from '@angular/core';
import { NavController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('myTabs', {static: false}) tabs: IonTabs;

  constructor(
    public navCtrl: NavController

  ) {}

  async openTab() {
    const tabSelected = this.tabs.getSelected();
    //console.log(tabSelected);
    //return this.tabs.outlet.pop(1, tabSelected);
    return await this.navCtrl.navigateRoot(this.tabs.outlet.tabsPrefix + '/' + tabSelected);
  }

}
