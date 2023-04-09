import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-admin-navbar",
  templateUrl: "./admin-navbar.component.html",
})
export class AdminNavbarComponent implements OnInit {
  logueado: any;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    if (this.usuarioService.uid) {
      console.log(this.usuarioService.uid);

      if (this.usuarioService.rol === "ROL_ALUMNO") {
        this.logueado = "alumno";
      }
    }
  }
}
