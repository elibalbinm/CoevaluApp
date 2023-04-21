import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoevaluacionComponent } from '../alumno/coevaluacion/coevaluacion.component';
import { AdminComponent } from 'src/app/layouts/admin/admin.component';
import { AuthGuard } from 'src/app/guards/auth.guards';

export const routes: Routes = [
  { path: "admin",
  component: AdminComponent,
    children: [
      { path: "evaluaciones/coevaluacion/:uid", component: CoevaluacionComponent, canActivate: [ AuthGuard ], data: {
        rol: 'ROL_ADMIN',
        titulo: 'Coevaluacion',
        breadcrums: [ {titulo: 'Coevaluaciones', url: '/admin/coevaluaciones'} ],
      },},
    ]
  }
];

@NgModule({
  declarations: [
    CoevaluacionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterModule.forChild(routes)
  ]
})
export class AluModule { }
