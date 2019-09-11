import { FinalComponent } from './components/final/final.component';
import { RegisterPage } from './register.page';
import { ElementComponent } from './components/element/element.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Element2Component } from './components/element2/element2.component';
import { PercentageComponent } from './components/percentage/percentage.component';
import { DefaultComponent } from './components/default/default.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage,
    children: [
      {
        path: 'default', 
        component: DefaultComponent
      },
      {
        path: 'element', 
        component: ElementComponent, 
        //canActivate: [WorkflowGuard]
      },
      {
        path: 'element2',
        component: Element2Component, 
        //canActivate: [WorkflowGuard]
      },
      {
        path: 'percentage',
        component: PercentageComponent, 
        //canActivate: [WorkflowGuard]
      },
      {
        path: 'final',
        component: FinalComponent, 
        //canActivate: [WorkflowGuard]
      },
      {
        path: '',
        redirectTo: 'default',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'default',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RegisterPageRoutingModule {}
