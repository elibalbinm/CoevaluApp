import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { DashboardProfComponent } from './dashboard/dashboardProf.component';

@NgModule({
  declarations: [
    DashboardProfComponent
  ],
  exports: [
    DashboardProfComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class ProfesorModule { }
