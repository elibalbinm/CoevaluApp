import { Component, OnInit, Input } from "@angular/core";
import { AsignaturaService } from "src/app/services/asignatura.service";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-card-notas',
  templateUrl: './card-notas.component.html'
})
export class CardNotasComponent implements OnInit {
  asignaturas = [];
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor( private asignaturaService: AsignaturaService,
    ) { }

  ngOnInit(): void {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(){
    this.asignaturaService.listaAsignaturasAlu(localStorage.getItem('uid'))
    .subscribe(res => {
      console.log(res['asignaturas'])
      this.asignaturas = res['asignaturas']
    });
  }

}
