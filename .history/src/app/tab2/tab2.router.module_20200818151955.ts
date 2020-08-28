import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMixComponent } from '../components';
import { MixListComponent } from './components/mix-list/mix-list.component';
import { MeasureComponent } from './components/measure/measure.component';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    children: [
      {
        path: 'mix-list', 
        component: MixListComponent, 
      },
      {
        path: 'edit-mix', 
        component: EditMixComponent
      },
      {
        path: 'measure', 
        component: MeasureComponent
      },
      {
        path: '',
        redirectTo: 'mix-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'mix-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
