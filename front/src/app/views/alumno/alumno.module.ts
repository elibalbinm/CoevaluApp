import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardTableComponent } from 'src/app/components/cards/card-table/card-table.component';
import { CoevaluacionComponent } from '../alumno/coevaluacion/coevaluacion.component';
import { AlumnoComponent } from './alumno.component';
import { SharedModule } from 'src/app/components/shared.module';
import { NotasComponent } from './notas/notas.component';
import { HeaderPanelComponent } from 'src/app/components/headers/header-panel/header-panel.component';
import { DashboardAluComponent } from './dashboard/dashboardAlu.component';
import { CardIteracionComponent } from 'src/app/components/cards/card-iteraciones/card-iteraciones.component';
import { IteracionAluComponent } from './iteracion/iteracion.component';

@NgModule({
  declarations: [
    AlumnoComponent,
    CardIteracionComponent,
    DashboardAluComponent,
    CoevaluacionComponent,
    CardTableComponent,
    HeaderPanelComponent,
    IteracionAluComponent,
    NotasComponent
  ],
  exports: [
    AlumnoComponent,
    CardIteracionComponent,
    DashboardAluComponent,
    CoevaluacionComponent,
    CardTableComponent,
    HeaderPanelComponent,
    IteracionAluComponent,
    NotasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class AluModule { }
