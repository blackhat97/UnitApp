import { AirCheckComponent } from './components/air-check/air-check.component';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { AirComponent } from './components/air/air.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Tab4Page } from './tab4.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Tab4Page,
    AirComponent,
    AirCheckComponent,
    AggregateComponent
  ],
  entryComponents: [
    AirComponent,
    AirCheckComponent,
    AggregateComponent
  ]
})
export class Tab4PageModule {}