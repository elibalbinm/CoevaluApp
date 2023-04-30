import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from 'src/app/layouts/alumno/alumno.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { CoevaluacionComponent } from './coevaluacion/coevaluacion.component';
import { AuthGuard } from 'src/app/guards/auth.guards';

/*
  /perfil                               [*]
  /admin/* --> páginas de administrador [ROL_ADMIN]
  /prof/*  --> páginas de profesor      [ROL_PROFESOR]
  /alu/*   --> páginas de alumno        [ROL_ALUMNO]

  data --> pasar informacion junto a la ruta para breadcrums y para AuthGuard {rol: 'ROL_ADMIN/ROL_PROFESOR/ROL_ALUMNO/*'}

*/

export const routes: Routes = [
  {
    path: "alumno",
    component: AlumnoComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: '*', titulo: 'Home'} },
      { path: "coevaluacion", component: CoevaluacionComponent, canActivate: [ AuthGuard ], data: {
                                                                                              rol: '*',
                                                                                              titulo: 'Coevaluación',
                                                                                              breadcrums: [ ],
                                                                                            },},
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
