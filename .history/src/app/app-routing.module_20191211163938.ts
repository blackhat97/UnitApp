import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './providers/guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: './layout/layout.module#LayoutModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'login', 
    loadChildren: './pages/login/login.module#LoginPageModule',
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
