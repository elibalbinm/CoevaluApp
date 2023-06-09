import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guards';
import { ProfesorComponent } from './profesor.component';
import { DashboardProfComponent } from './dashboard/dashboardProf.component';
import { AsignaturasComponent } from '../asignaturas/asignaturas.component';
import { RubricaComponent } from '../rubrica/rubrica.component';
import { RubricasComponent } from '../rubricas/rubricas.component';
import { GrupoComponent } from '../grupo/grupo.component';
import { GruposComponent } from '../grupos/grupos.component';
import { CriterioComponent } from '../criterio/criterio.component';
import { CriteriosComponent } from '../criterios/criterios.component';
import { AsignaturaComponent } from '../asignatura/asignatura.component';
import {DashboardComponent} from "../admin/dashboard/dashboard.component";

/*
  /perfil                               [*]
  /admin/* --> páginas de administrador [ROL_ADMIN]
  /prof/*  --> páginas de profesor      [ROL_PROFESOR]
  /alu/*   --> páginas de alumno        [ROL_ALUMNO]

  data --> pasar informacion junto a la ruta para breadcrums y para AuthGuard {rol: 'ROL_ADMIN/ROL_PROFESOR/ROL_ALUMNO/*'}

*/

const routes: Routes = [
  {
    path: 'profesor',
    component: ProfesorComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { rol: '*', titulo: 'Dashboard' },
      },
      {
        path: 'asignaturas',
        component: AsignaturasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Asignaturas',
          breadcrums: []
        }
      },
      {
        path: 'asignaturas/asignatura/:uid',
        component: AsignaturaComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Asignatura',
          breadcrums: [{ titulo: 'Asignaturas', url: '/profesor/asignaturas' }]
        }
      },
      {
        path: 'criterios',
        component: CriteriosComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Criterios',
          breadcrums: []
        }
      },
      {
        path: 'criterios/criterio/:uid',
        component: CriterioComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Criterio',
          breadcrums: [{ titulo: 'Criterios', url: '/profesor/criterios' }]
        }
      },
      {
        path: 'grupos',
        component: GruposComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Grupos',
          breadcrums: []
        }
      },
      {
        path: 'grupos/grupo/:uid',
        component: GrupoComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Grupo',
          breadcrums: [{ titulo: 'Grupos', url: '/profesor/grupos' }]
        }
      },
      {
        path: 'rubricas',
        component: RubricasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Rubricas',
          breadcrums: []
        }
      },
      {
        path: 'rubricas/rubrica/:uid',
        component: RubricaComponent,
        canActivate: [AuthGuard],
        data: {
          rol: 'ROL_PROFESOR',
          titulo: 'Rubrica',
          breadcrums: [{ titulo: 'Rubricas', url: '/profesor/rubricas' }]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesorRoutingModule {}
