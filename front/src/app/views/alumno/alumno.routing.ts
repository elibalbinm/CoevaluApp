import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from './alumno.component';
import { CoevaluacionComponent } from './coevaluacion/coevaluacion.component';
import { AuthGuard } from 'src/app/guards/auth.guards';
import { DashboardAluComponent } from './dashboard/dashboardAlu.component';
import { NotasComponent } from './notas/notas.component';
import { IteracionAluComponent } from './iteracion/iteracion.component';

/*
  /perfil                               [*]
  /admin/* --> páginas de administrador [ROL_ADMIN]
  /prof/*  --> páginas de profesor      [ROL_PROFESOR]
  /alu/*   --> páginas de alumno        [ROL_ALUMNO]

  data --> pasar informacion junto a la ruta para breadcrums y para AuthGuard {rol: 'ROL_ADMIN/ROL_PROFESOR/ROL_ALUMNO/*'}

*/

const routes: Routes = [
  {
    path: 'alumno',
    component: AlumnoComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardAluComponent,
        canActivate: [AuthGuard],
        data: { rol: '*', titulo: 'Dashboard' },
      },
      {
        path: 'coevaluacion',
        component: CoevaluacionComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Coevaluación',
          breadcrums: [],
        },
      },
      {
        path: 'coevaluacion/iteracion/:uid',
        component: IteracionAluComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Iteración',
          breadcrums: [ {titulo: 'Iteración', url: '/alumno/coevaluacion'} ],
        },
      },
      {
        path: 'notas',
        component: NotasComponent,
        canActivate: [AuthGuard],
        data: {
          rol: '*',
          titulo: 'Notas',
          breadcrums: [],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnoRoutingModule {}
