import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Guards
import { AuthGuard } from '../../src/app/guards/auth.guards'
import { NoauthGuard } from '../../src/app/guards/noauth.guard'

// layouts
import { AdminComponent } from './layouts/admin/admin.component'
import { AuthComponent } from './layouts/auth/auth.component'

// admin views
import { DashboardComponent } from './views/admin/dashboard/dashboard.component'
import { AsignaturaComponent } from './views/asignatura/asignatura.component'
import { AsignaturasComponent } from './views/asignaturas/asignaturas.component'
import { CriteriosComponent } from './views/criterios/criterios.component'
import { CriterioComponent } from './views/criterio/criterio.component'
import { CursoComponent } from './views/curso/curso.component'
import { CursosComponent } from './views/cursos/cursos.component'
import { EvaluacionesComponent } from './views/evaluaciones/evaluaciones.component'
import { EvaluacionComponent } from './views/evaluacion/evaluacion.component'
import { GruposComponent } from './views/grupos/grupos.component'
import { GrupoComponent } from './views/grupo/grupo.component'
import { IteracionesComponent } from './views/iteraciones/iteraciones.component'
import { IteracionComponent } from './views/iteracion/iteracion.component'
import { UserComponent } from './views/user/user.component'
import { UsersComponent } from './views/users/users.component'
import { RubricaComponent } from './views/rubrica/rubrica.component'
import { RubricasComponent } from './views/rubricas/rubricas.component'

// alu views
import { AlumnoRoutingModule } from './views/alumno/alumno.routing'

// prof views
import { ProfesorRoutingModule } from './views/profesor/profesor.routing'

// auth views
import { LoginComponent } from './views/auth/login/login.component'
import { RegisterComponent } from './views/auth/register/register.component'

import { ProfileComponent } from './views/profile/profile.component'
import { EscalasComponent } from './views/escalas/escalas.component'
import { EscalaComponent } from './views/escala/escala.component'
import { CoevaluacionComponent } from './views/alumno/coevaluacion/coevaluacion.component'

const routes: Routes = [
  // admin views
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { rol: 'ROL_ADMIN', titulo: 'Home' }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { rol: 'ROL_ADMIN', titulo: 'Users' }
      },
      {
        path: 'users/user/:uid',
        component: UserComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Users',
          breadcrums: [{ titulo: 'Users', url: '/admin/users' }]
        }
      },
      {
        path: 'asignaturas',
        component: AsignaturasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Asignaturas',
          breadcrums: []
        }
      },
      {
        path: 'asignaturas/asignatura/:uid',
        component: AsignaturaComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Asignatura',
          breadcrums: [{ titulo: 'Asignaturas', url: '/admin/asignaturas' }]
        }
      },
      {
        path: 'cursos',
        component: CursosComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Cursos',
          breadcrums: []
        }
      },
      {
        path: 'coevaluacion',
        component: CoevaluacionComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Coevaluacion',
          breadcrums: []
        }
      },
      {
        path: 'criterios',
        component: CriteriosComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Criterios',
          breadcrums: []
        }
      },
      {
        path: 'criterios/criterio/:uid',
        component: CriterioComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Criterio',
          breadcrums: [{ titulo: 'Criterios', url: '/admin/criterios' }]
        }
      },
      {
        path: 'cursos',
        component: CursosComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Cursos',
          breadcrums: []
        }
      },
      {
        path: 'cursos/curso/:uid',
        component: CursoComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Curso',
          breadcrums: [{ titulo: 'Cursos', url: '/admin/cursos' }]
        }
      },
      {
        path: 'evaluaciones',
        component: EvaluacionesComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Evaluaciones',
          breadcrums: []
        }
      },
      {
        path: 'evaluaciones/evaluacion/:uid',
        component: EvaluacionComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Evaluacion',
          breadcrums: [{ titulo: 'Evaluaciones', url: '/admin/evaluaciones' }]
        }
      },
      {
        path: 'escalas',
        component: EscalasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Escalas',
          breadcrums: []
        }
      },
      {
        path: 'escalas/escala/:uid',
        component: EscalaComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Escala',
          breadcrums: [{ titulo: 'Escalas', url: '/admin/escalas' }]
        }
      },
      {
        path: 'iteraciones',
        component: IteracionesComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Iteraciones',
          breadcrums: []
        }
      },
      {
        path: 'iteraciones/iteracion/:uid',
        component: IteracionComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Iteracion',
          breadcrums: [{ titulo: 'Iteraciones', url: '/admin/iteraciones' }]
        }
      },
      {
        path: 'grupos',
        component: GruposComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Grupos',
          breadcrums: []
        }
      },
      {
        path: 'grupos/grupo/:uid',
        component: GrupoComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Grupo',
          breadcrums: [{ titulo: 'Grupos', url: '/admin/grupos' }]
        }
      },
      {
        path: 'rubricas',
        component: RubricasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Rubricas',
          breadcrums: []
        }
      },
      {
        path: 'rubricas/rubrica/:uid',
        component: RubricaComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_ADMIN',
          titulo: 'Rubrica',
          breadcrums: [{ titulo: 'Rubricas', url: '/admin/rubricas' }]
        }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  // {
  //   path: 'prof',
  //   component: ProfesorComponent,
  //   children: [
  //     { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_PROFESOR', titulo: 'Home'} },
  //     { path: 'asignaturas', component: AsignaturasComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Asignaturas',
  //         breadcrums: [ ],
  //       },},
  //     { path: 'asignaturas/asignatura/:uid', component: AsignaturaComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Asignatura',
  //         breadcrums: [ {titulo: 'Asignaturas', url: '/admin/asignaturas'} ],
  //       },},
  //     { path: 'criterios', component: CriteriosComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Criterios',
  //         breadcrums: [ ],
  //       },
  //     },
  //     { path: 'criterios/criterio/:uid', component: CriterioComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Criterio',
  //         breadcrums: [ {titulo: 'Criterios', url: '/prof/criterios'} ],
  //       },},
  //     { path: 'grupos', component: GruposComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Grupos',
  //         breadcrums: [ ],
  //       },},
  //     { path: 'grupos/grupo/:uid', component: GrupoComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Grupo',
  //         breadcrums: [ {titulo: 'Grupos', url: '/prof/grupos'} ],
  //       },},
  //     { path: 'rubricas', component: RubricasComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Rubricas',
  //         breadcrums: [ ],
  //       },},
  //     { path: 'rubricas/rubrica/:uid', component: RubricaComponent, canActivate: [ AuthGuard ], data: {
  //         rol: 'ROL_PROFESOR',
  //         titulo: 'Rubrica',
  //         breadcrums: [ {titulo: 'Rubricas', url: '/prof/rubricas'} ],
  //       },},
  //     { path: 'settings', component: SettingsComponent },
  //     { path: 'tables', component: TablesComponent },
  //     { path: 'maps', component: MapsComponent },
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //   ],
  // },
  // auth views
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent, canActivate: [NoauthGuard] },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  // prof views

  // alumno views
  // {
  //   path: 'alumno',
  //   component: AlumnoComponent,
  //   children: [
  //     { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: '*', titulo: 'Home'} },
  //     // { path: 'coevaluacion', component: CoevaluacionComponent, canActivate: [ AuthGuard ], data: {
  //     //                                                                                         rol: 'ROL_ALUMNO',
  //     //                                                                                         titulo: 'Coevaluación',
  //     //                                                                                         breadcrums: [ ],
  //     //                                                                                       },},
  //     { path: 'settings', component: SettingsComponent },
  //     { path: 'tables', component: TablesComponent },
  //     { path: 'maps', component: MapsComponent },
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //   ],
  // },
  // no layout views
  { path: 'profile', component: ProfileComponent },
  //{ path: 'landing', component: LandingComponent },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AlumnoRoutingModule,
    ProfesorRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
