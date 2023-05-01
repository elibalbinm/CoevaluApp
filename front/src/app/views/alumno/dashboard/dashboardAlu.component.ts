import { Component, OnInit } from "@angular/core";
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: "app-dashboard-alu",
  templateUrl: "./dashboardAlu.component.html",
})
export class DashboardAluComponent implements OnInit {
  logueado = "admin";
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {

    if(this.usuarioService.uid){
      console.log(this.usuarioService.uid);

      if(this.usuarioService.rol == 'ROL_PROFESOR'){
        this.logueado = "profe";
      }
    }

  }
}
