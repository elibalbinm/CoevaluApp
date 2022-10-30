import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Guards
import { AuthGuard } from '../../src/app/guards/auth.guards';
import { NoauthGuard } from '../../src/app/guards/noauth.guard';

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { UserComponent } from "./views/user/user.component";
import { UsersComponent } from "./views/users/users.component";
import { MapsComponent } from "./views/admin/maps/maps.component";
import { SettingsComponent } from "./views/admin/settings/settings.component";
import { TablesComponent } from "./views/admin/tables/tables.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";



const routes: Routes = [
  // admin views
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: '*', titulo: 'Home'} },
      { path: "users", component: UsersComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ADMIN', titulo: 'Users'} },
      { path: "users/user/:uid", component: UserComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ADMIN',
                                                                                              titulo: 'Users',
                                                                                              breadcrums: [ {titulo: 'Users', url: '/admin/users'} ]} },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent, canActivate: [ NoauthGuard ] },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  // prof views
  {
    path: "prof",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: '*', titulo: 'Home'} },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  // alumno views
  {
    path: "alu",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: '*', titulo: 'Home'} },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  // no layout views
  { path: "profile", component: ProfileComponent },
  //{ path: "landing", component: LandingComponent },
  { path: "", component: LandingComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
