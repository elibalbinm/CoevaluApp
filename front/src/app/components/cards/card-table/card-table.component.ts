import { Component, OnInit, Input } from "@angular/core";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-card-table",
  templateUrl: "./card-table.component.html",
})
export class CardTableComponent implements OnInit {
  iteraciones: [];

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor (private iteracionService: IteracionService ) {}

  ngOnInit(): void {
    this.iteracionService.cargarIteraciones(0)
    .subscribe(res => {
      this.iteraciones = res['iteraciones'];
      console.log(res['iteraciones']);
    }, (err)=> {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
    });
  }
}
