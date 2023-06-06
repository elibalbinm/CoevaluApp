import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";
import { AluModule } from "./views/alumno/alumno.module";
import { AppComponent } from "./app.component";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { MapsComponent } from "./views/admin/maps/maps.component";
import { SettingsComponent } from "./views/admin/settings/settings.component";
import { TablesComponent } from "./views/admin/tables/tables.component";
import { UsersComponent } from './views/users/users.component';
import { UserComponent } from './views/user/user.component';
import { AsignaturaComponent } from './views/asignatura/asignatura.component';
import { AsignaturasComponent } from './views/asignaturas/asignaturas.component';
import { CursosComponent } from './views/cursos/cursos.component';
import { CursoComponent } from './views/curso/curso.component';
import { GruposComponent } from './views/grupos/grupos.component';
import { GrupoComponent } from './views/grupo/grupo.component';
import { IteracionesComponent } from './views/iteraciones/iteraciones.component';
import { IteracionComponent } from './views/iteracion/iteracion.component';

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";

// components for views and layouts
import { AuthNavbarComponent } from "./components/navbars/auth-navbar/auth-navbar.component";

import { CardBarChartComponent } from "./components/cards/card-bar-chart/card-bar-chart.component";
import { CardLineChartComponent } from "./components/cards/card-line-chart/card-line-chart.component";
import { CardPageVisitsComponent } from "./components/cards/card-page-visits/card-page-visits.component";
import { CardProfileComponent } from "./components/cards/card-profile/card-profile.component";
import { CardSettingsComponent } from "./components/cards/card-settings/card-settings.component";
import { CardSocialTrafficComponent } from "./components/cards/card-social-traffic/card-social-traffic.component";
import { CardStatsComponent } from "./components/cards/card-stats/card-stats.component";
import { CardUsersComponent } from './components/cards/card-users/card-users.component';
import { FooterComponent } from "./components/footers/footer/footer.component";
import { FooterSmallComponent } from "./components/footers/footer-small/footer-small.component";
import { IndexNavbarComponent } from "./components/navbars/index-navbar/index-navbar.component";
import { MapExampleComponent } from "./components/maps/map-example/map-example.component";
import { IndexDropdownComponent } from "./components/dropdowns/index-dropdown/index-dropdown.component";
import { TableDropdownComponent } from "./components/dropdowns/table-dropdown/table-dropdown.component";
import { PagesDropdownComponent } from "./components/dropdowns/pages-dropdown/pages-dropdown.component";
import { PaginationComponent } from './components/pagination/pagination.component';
import { PillsComponent } from './components/pills/pills.component';
import { CardSelectUserComponent } from './components/cards/card-select-user/card-select-user.component';
import { RubricasComponent } from './views/rubricas/rubricas.component';
import { RubricaComponent } from './views/rubrica/rubrica.component';
import { CriteriosComponent } from './views/criterios/criterios.component';
import { CriterioComponent } from './views/criterio/criterio.component';
import { EscalasComponent } from './views/escalas/escalas.component';
import { EscalaComponent } from './views/escala/escala.component';
import { ProfesorComponent } from './views/profesor/profesor.component';
import { PanelComponent } from './components/panel/panel.component';
import { EvaluacionesComponent } from './views/evaluaciones/evaluaciones.component';
import { EvaluacionComponent } from './views/evaluacion/evaluacion.component';
import { AlumnoRoutingModule } from "./views/alumno/alumno.routing";
import { SharedModule } from "./components/shared.module";
import { ProfesorModule } from "./views/profesor/profesor.module";
import { ProfesorRoutingModule } from "./views/profesor/profesor.routing";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardBarChartComponent,
    CardLineChartComponent,
    IndexDropdownComponent,
    PagesDropdownComponent,
    TableDropdownComponent,
    FooterComponent,
    FooterSmallComponent,
    CardPageVisitsComponent,
    CardProfileComponent,
    CardSettingsComponent,
    CardSocialTrafficComponent,
    CardStatsComponent,
    MapExampleComponent,
    AuthNavbarComponent,
    IndexNavbarComponent,
    AdminComponent,
    AuthComponent,
    MapsComponent,
    SettingsComponent,
    TablesComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    LandingComponent,
    ProfileComponent,
    UsersComponent,
    CardUsersComponent,
    UserComponent,
    PaginationComponent,
    AsignaturasComponent,
    AsignaturaComponent,
    PillsComponent,
    CardSelectUserComponent,
    CursosComponent,
    CursoComponent,
    GruposComponent,
    GrupoComponent,
    RubricasComponent,
    RubricaComponent,
    CriteriosComponent,
    CriterioComponent,
    EscalasComponent,
    EscalaComponent,
    ProfesorComponent,
    PanelComponent,
    IteracionesComponent,
    IteracionComponent,
    EvaluacionesComponent,
    EvaluacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    ProfesorModule,
    AluModule,

    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "es" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
