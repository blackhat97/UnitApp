import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './providers/guard/auth-guard.service';

const routes: Routes = [
  /*
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  */
  {
    path: '',
    //loadChildren: './tabs/tabs.module#TabsPageModule',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    //canActivate: [AuthGuardService]
  },
  {
    path: 'mix-list', 
    loadChildren: './pages/mix-list/mix-list.module#MixListPageModule',
  },
  {
    path: 'complete-list', 
    loadChildren: './pages/complete-list/complete-list.module#CompleteListPageModule',
  },
  {
    path: 'time-series', 
    loadChildren: './pages/time-series/time-series.module#TimeSeriesPageModule',
  },
  {
    path: 'register', 
    loadChildren: './pages/register/register.module#RegisterPageModule',
  },
  { 
    path: 'details/:id', 
    loadChildren: './pages/details/details.module#DetailsPageModule',
  },
  { 
    path: 'bluetooth', 
    loadChildren: './pages/bluetooth/bluetooth.module#BluetoothPageModule',
  },
  { 
    path: 'bluetooths', 
    loadChildren: './pages/bluetooths/bluetooths.module#BluetoothsPageModule',
  },


  {
    path: 'login', 
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'signup', 
    loadChildren: './pages/signup/signup.module#SignupPageModule'
  },
  {
    path: 'forgot', 
    loadChildren: './pages/forgot/forgot.module#ForgotPageModule'
  },
  {
    path: 'reset/:token', 
    loadChildren: './pages/reset/reset.module#ResetPageModule'
  },
  { path: 'not-found', loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
  { path: '**', redirectTo: 'not-found' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
