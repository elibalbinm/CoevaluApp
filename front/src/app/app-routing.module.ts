import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Guards
import { AuthGuard } from '../../src/app/guards/auth.guards';
import { NoauthGuard } from '../../src/app/guards/noauth.guard';

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { ProfesorComponent } from "./layouts/profesor/profesor.component";
import { AlumnoComponent } from "./layouts/alumno/alumno.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { AsignaturaComponent } from './views/asignatura/asignatura.component';
import { AsignaturasComponent } from './views/asignaturas/asignaturas.component';
import { CriteriosComponent } from "./views/criterios/criterios.component";
import { CriterioComponent } from "./views/criterio/criterio.component";
import { CursoComponent } from "./views/curso/curso.component";
import { CursosComponent } from "./views/cursos/cursos.component";
import { GruposComponent } from "./views/grupos/grupos.component";
import { GrupoComponent } from "./views/grupo/grupo.component";
import { UserComponent } from "./views/user/user.component";
import { UsersComponent } from "./views/users/users.component";
import { MapsComponent } from "./views/admin/maps/maps.component";
import { RubricaComponent } from "./views/rubrica/rubrica.component";
import { RubricasComponent } from "./views/rubricas/rubricas.component";
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
      { path: "users",     component: UsersComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ADMIN', titulo: 'Users'} },
      { path: "users/user/:uid", component: UserComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ADMIN',
                                                                                              titulo: 'Users',
                                                                                              breadcrums: [ {titulo: 'Users', url: '/admin/users'} ]} },
      { path: "asignaturas", component: AsignaturasComponent, canActivate: [ AuthGuard ], data: {
                                                                                                  rol: 'ROL_ADMIN',
                                                                                                  titulo: 'Asignaturas',
                                                                                                  breadcrums: [ ],
                                                                                                },},
      { path: "asignaturas/asignatura/:uid", component: AsignaturaComponent, canActivate: [ AuthGuard ], data: {
                                                                                                                rol: 'ROL_ADMIN',
                                                                                                                titulo: 'Asignatura',
                                                                                                                breadcrums: [ {titulo: 'Asignaturas', url: '/admin/asignaturas'} ],
                                                                                                              },},
                                                                                                              { path: "cursos", component: CursosComponent, canActivate: [ AuthGuard ], data: {
                                                                                                                rol: 'ROL_ADMIN',
                                                                                                                titulo: 'Cursos',
                                                                                                                breadcrums: [ ],
                                                                                                              },},
      { path: "criterios", component: CriteriosComponent, canActivate: [ AuthGuard ], data: {
                                                                                        rol: 'ROL_ADMIN',
                                                                                        titulo: 'Criterios',
                                                                                        breadcrums: [ ],
                                                                                      },},
      { path: "criterios/criterio/:uid", component: CriterioComponent, canActivate: [ AuthGuard ], data: {
                                                                                                  rol: 'ROL_ADMIN',
                                                                                                  titulo: 'Criterio',
                                                                                                  breadcrums: [ {titulo: 'Criterios', url: '/admin/criterios'} ],
                                                                                                },},
      { path: "cursos", component: CursosComponent, canActivate: [ AuthGuard ], data: {
                                                                                        rol: 'ROL_ADMIN',
                                                                                        titulo: 'Cursos',
                                                                                        breadcrums: [ ],
                                                                                      },},
      { path: "cursos/curso/:uid", component: CursoComponent, canActivate: [ AuthGuard ], data: {
                                                                                                  rol: 'ROL_ADMIN',
                                                                                                  titulo: 'Curso',
                                                                                                  breadcrums: [ {titulo: 'Cursos', url: '/admin/cursos'} ],
                                                                                                },},
      { path: "grupos", component: GruposComponent, canActivate: [ AuthGuard ], data: {
                                                                                        rol: 'ROL_ADMIN',
                                                                                        titulo: 'Grupos',
                                                                                        breadcrums: [ ],
                                                                                      },},
      { path: "grupos/grupo/:uid", component: GrupoComponent, canActivate: [ AuthGuard ], data: {
                                                                                                  rol: 'ROL_ADMIN',
                                                                                                  titulo: 'Grupo',
                                                                                                  breadcrums: [ {titulo: 'Grupos', url: '/admin/grupos'} ],
                                                                                                },},
      { path: "rubricas", component: RubricasComponent, canActivate: [ AuthGuard ], data: {
                                                                                        rol: 'ROL_ADMIN',
                                                                                        titulo: 'Rubricas',
                                                                                        breadcrums: [ ],
                                                                                      },},
      { path: "rubricas/rubrica/:uid", component: RubricaComponent, canActivate: [ AuthGuard ], data: {
                                                                                                  rol: 'ROL_ADMIN',
                                                                                                  titulo: 'Rubrica',
                                                                                                  breadcrums: [ {titulo: 'Rubricas', url: '/admin/rubricas'} ],
                                                                                                },},

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
    component: ProfesorComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_PROFESOR', titulo: 'Home'} },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  // alumno views
  {
    path: "alu",
    component: AlumnoComponent,
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
