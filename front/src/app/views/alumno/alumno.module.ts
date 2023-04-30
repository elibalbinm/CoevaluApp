import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardTableComponent } from 'src/app/components/cards/card-table/card-table.component';
import { CoevaluacionComponent } from '../alumno/coevaluacion/coevaluacion.component';
import { AdminComponent } from 'src/app/layouts/admin/admin.component';
import { AuthGuard } from 'src/app/guards/auth.guards';

export const routes: Routes = [
  { path: "admin",
  component: AdminComponent,
    children: [
      { path: "coevaluacion", component: CoevaluacionComponent, canActivate: [ AuthGuard ], data: {
        rol: 'ROL_ADMIN',
        titulo: 'Coevaluacion',
        breadcrums: [],
      },},
    ]
  }
];

@NgModule({
  declarations: [
    CoevaluacionComponent,
    CardTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterModule.forChild(routes)
  ]
})
export class AluModule { }
