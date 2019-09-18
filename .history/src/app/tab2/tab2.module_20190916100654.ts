import { ExpandMixComponent } from './../components/expand-mix/expand-mix.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ResultComponent } from '../components/result/result.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [
    Tab2Page,
    ResultComponent,
    ExpandMixComponent
  ],
  entryComponents: [
    ResultComponent,
    ExpandMixComponent
  ]
})
export class Tab2PageModule {}
