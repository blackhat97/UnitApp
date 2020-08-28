import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { EditMixComponent, MixListComponent, MeasureComponent, ResultComponent } from './components';

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
