import { Component, OnInit, Input } from "@angular/core";
import { IteracionService } from "src/app/services/iteracion.service";
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard-alu",
  templateUrl: "./dashboardAlu.component.html",
})
export class DashboardAluComponent implements OnInit {
  logueado = "admin";
  iteraciones: [] = [];

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  constructor(private usuarioService: UsuarioService,
              private iteracionService: IteracionService) {}

  ngOnInit(): void {

    if(this.usuarioService.uid){
      console.log(this.usuarioService.uid);

      if(this.usuarioService.rol == 'ROL_PROFESOR'){
        this.logueado = "profe";
      }
    }

    this.cargarIteraciones("");

  }

  cargarIteraciones( texto: string ) {
    this.iteracionService.cargarIteraciones(0)
    .subscribe( res => {
      this.iteraciones = res['iteraciones'];
    }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
      });
  }
}
