import { EditMixComponent } from './../../components/edit-mix/edit-mix.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MixListPage } from './mix-list.page';

const routes: Routes = [
  {
    path: '',
    component: MixListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MixListPage,
    EditMixComponent
  ],
  entryComponents: [
    EditMixComponent
  ]
})
export class MixListPageModule {}
