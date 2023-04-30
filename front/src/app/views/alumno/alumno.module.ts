import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardTableComponent } from 'src/app/components/cards/card-table/card-table.component';
import { CoevaluacionComponent } from '../alumno/coevaluacion/coevaluacion.component';
import { AlumnoComponent } from 'src/app/layouts/alumno/alumno.component';

@NgModule({
  declarations: [
    AlumnoComponent,
    CoevaluacionComponent,
    CardTableComponent,
  ],
  exports: [
    AlumnoComponent,
    CoevaluacionComponent,
    CardTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ]
})
export class AluModule { }
