import { Component, OnInit, Input } from "@angular/core";
import { Iteracion } from "src/app/models/iteracion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-card-iteraciones",
  templateUrl: "./card-iteraciones.component.html",
})
export class CardIteracionComponent implements OnInit {
  iteraciones: [];
  criterios: [];

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor (private iteracionService: IteracionService,
               private criterioService: CriterioService ) {}

  ngOnInit(): void {
    this.iteracionService.cargarIteraciones(0)
    .subscribe(res => {
      this.iteraciones = res['iteraciones'];
      console.log(res['iteraciones']);
    }, (err)=> {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
    });

    this.criterioService.cargarCriterios(0)
      .subscribe( res => {
        this.criterios = res['criterios'];
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
      });
  }
}
