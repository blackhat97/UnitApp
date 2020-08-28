import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MixListComponent } from './components/mix-list/mix-list.component';
import { MeasureComponent } from './components/measure/measure.component';
import { Tab2Page } from './tab2.page';
import { EditMixComponent, ResultComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    children: [
      {
        path: 'mix-list', 
        component: MixListComponent
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
        path: 'result', 
        component: ResultComponent
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
