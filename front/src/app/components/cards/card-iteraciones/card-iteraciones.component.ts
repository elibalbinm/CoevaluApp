import { Component, OnInit, Input } from "@angular/core";
import { Iteracion } from "src/app/models/iteracion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { IteracionService } from "src/app/services/iteracion.service";
import { UsuarioService } from "src/app/services/usuario.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-card-iteraciones",
  templateUrl: "./card-iteraciones.component.html",
})
export class CardIteracionComponent implements OnInit {
  iteraciones: [];
  criterios: [];
  uidAlumno: string;
  curso: string;

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor (private iteracionService: IteracionService,
               private criterioService: CriterioService,
               private usuarioService: UsuarioService ) {}

  ngOnInit(): void {

    // Obtenemos información del alumno para pasarle al servicio de Iteracion el uid del curso académico
    this.uidAlumno = localStorage.getItem('uid');

    this.usuarioService.cargarUsuario(this.uidAlumno)
    .subscribe(res => {
      this.curso = res['usuarios']['curso']._id;
      this.cargarIteraciones(res['usuarios']['curso']._id);
    })

    this.criterioService.cargarCriterios(0)
      .subscribe( res => {
        this.criterios = res['criterios'];
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
      });
  }

  cargarIteraciones(curso: any){
    console.log("🚀 ~ file: card-iteraciones.component.ts:39 ~ CardIteracionComponent ~ ngOnInit ~ curso:", this.curso)

    this.iteracionService.cargarListadoIteraciones(curso)
    .subscribe(res => {
      this.iteraciones = res['iteraciones'];
      console.log(res['iteraciones']);
    }, (err)=> {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
    });
  }
}
