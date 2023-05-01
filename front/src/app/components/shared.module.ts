import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from './navbars/admin-navbar/admin-navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderStatsComponent } from './headers/header-stats/header-stats.component';
import { FooterAdminComponent } from './footers/footer-admin/footer-admin.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports:
  [
    CommonModule,
    AppRoutingModule ],
  declarations:
    [
      AdminNavbarComponent,
      SidebarComponent,
      HeaderStatsComponent,
      FooterAdminComponent
    ],
  exports:
  [
    AdminNavbarComponent,
    SidebarComponent,
    HeaderStatsComponent,
    FooterAdminComponent,
    CommonModule,
    FormsModule
  ]
})

export class SharedModule { }