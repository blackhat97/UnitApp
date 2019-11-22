import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './providers/guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'mix-list', 
    loadChildren: './pages/mix-list/mix-list.module#MixListPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'complete-list', 
    loadChildren: './pages/complete-list/complete-list.module#CompleteListPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'time-series', 
    loadChildren: './pages/time-series/time-series.module#TimeSeriesPageModule',
    canActivate: [AuthGuardService]
  },
  { 
    path: 'register', 
    loadChildren: './pages/register/register.module#RegisterPageModule',
    canActivate: [AuthGuardService]
  },
  { 
    path: 'details/:id', 
    loadChildren: './pages/details/details.module#DetailsPageModule',
    canActivate: [AuthGuardService]
  },
  { 
    path: 'bluetooth', 
    loadChildren: './pages/bluetooth/bluetooth.module#BluetoothPageModule',
    canActivate: [AuthGuardService]
  },
  { 
    path: 'bluetooths', 
    loadChildren: './pages/bluetooths/bluetooths.module#BluetoothsPageModule',
    canActivate: [AuthGuardService]
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

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
