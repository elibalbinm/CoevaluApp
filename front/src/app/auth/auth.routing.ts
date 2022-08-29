import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { NoauthGuard } from '../guards/noauth.guard';

const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: LoginComponent},
    ]
  },
  { path: 'recovery', component: AuthLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: RecoveryComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
