import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/app/tabs/tab1', pathMatch: 'full' },
            {
              path: 'tabs',
              loadChildren: '../tabs/tabs.module#TabsPageModule'
            },
            {
              path: 'mix-list', 
              loadChildren: '../pages/mix-list/mix-list.module#MixListPageModule',
            },
            {
              path: 'complete-list', 
              loadChildren: '../pages/complete-list/complete-list.module#CompleteListPageModule',
            },
            {
              path: 'time-series', 
              loadChildren: '../pages/time-series/time-series.module#TimeSeriesPageModule',
            },
            {
              path: 'register', 
              loadChildren: '../pages/register/register.module#RegisterPageModule',
            },
            {
              path: 'outcome/:id',
              loadChildren: '../pages/outcome/outcome.module#OutcomePageModule',
            },
            { 
              path: 'details/:id',
              loadChildren: '../pages/details/details.module#DetailsPageModule',
            },
            { 
              path: 'bluetooth', 
              loadChildren: '../pages/bluetooth/bluetooth.module#BluetoothPageModule',
            },
            { 
              path: 'bluetooths', 
              loadChildren: '../pages/bluetooths/bluetooths.module#BluetoothsPageModule',
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
