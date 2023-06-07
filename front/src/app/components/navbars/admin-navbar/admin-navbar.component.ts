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
    const roles: { [key: string]: string } = {
      "ROL_ALUMNO": "alumno",
      "ROL_PROFESOR": "profesor",
      "ROL_ADMIN": "admin",
    };

    if (this.usuarioService.uid) {
        this.logueado = roles[this.usuarioService.rol];
    }
  }
}
