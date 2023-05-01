import { Component, OnInit, Input } from "@angular/core";
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: "app-dashboard-alu",
  templateUrl: "./dashboardAlu.component.html",
})
export class DashboardAluComponent implements OnInit {
  logueado = "admin";

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
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
