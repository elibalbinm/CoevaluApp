import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnoComponent } from './alumno.component';

@NgModule({
  declarations: [
    AlumnoComponent,
  ],
  exports: [
    AlumnoComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class AluModule { }
