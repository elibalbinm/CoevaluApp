import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardTableComponent } from 'src/app/components/cards/card-table/card-table.component';
import { CoevaluacionComponent } from '../alumno/coevaluacion/coevaluacion.component';
import { AlumnoComponent } from './alumno.component';
import { SharedModule } from 'src/app/components/shared.module';

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
    SharedModule
  ]
})
export class AluModule { }
