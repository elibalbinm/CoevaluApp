import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Evaluacion } from "src/app/models/evaluacion.model";
import { Iteracion } from "src/app/models/iteracion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-iteracion-alu",
  templateUrl: "./iteracion.component.html",
})
export class IteracionAluComponent implements OnInit {
  evaluaciones: Evaluacion[] = [];
  escalaId: any;
  submited: boolean = false;
  arrayCriterios: any;
  arrayCriteriosPorEscala: any;
  arrayAlumnos: any;
  escalasPorCriterio: any;
  arrayVotaciones: { alumno_votado: string; escala: string; valor: string }[];
  guardarVacio: { criterio: string; votaciones: any }[];

  iteracion: [];
  criterios: [];

  evaluacion: any;

  id: string = '';
  uidAlumno: any;
  numIteracion: string = '';

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor (private iteracionService: IteracionService,
               private evaluacionService: EvaluacionService,
               private criterioService: CriterioService,
               private route: ActivatedRoute,
               private router: Router ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['uid']);
    this.id = this.route.snapshot.params['uid'];
    this.cargarIteracion();

    this.uidAlumno = localStorage.getItem('uid');
    this.cargarEvaluacion();
  }

  cargarIteracion() {
    this.iteracionService.cargarIteracion(this.id)
    .subscribe(res => {
      if (!res['iteracion']) {
        this.router.navigateByUrl('/alumno/coevaluacion/');
        return;
      };

      this.iteracion = res['iteracion'];
      this.numIteracion = res['iteracion'].iteracion;
    })
  }

  cargarEvaluacion() {
    console.log('Cargar Evaluacion: ');
    this.evaluacionService.getEvaluationByStudent(this.uidAlumno)
      .subscribe(res => {
        console.log(res['evaluaciones']);
        this.evaluaciones = res['evaluaciones'][0].valores;
        console.log('Evaluaciones (valores): ', this.evaluaciones);

        this.arrayCriterios = res['evaluaciones'][0].valores.map((_) => ({
          id: `${_.criterio._id}`,
        }));

        res['evaluaciones'][0].valores
          .map((item) => {
            this.arrayAlumnos = [];

            item.votaciones.map((_) => {
              console.log('+`+++++++++++++++++++++', _.alumno_votado);

              const x = {
                id: _.alumno_votado._id,
                nombre:
                  _.alumno_votado.nombre + ' ' + _.alumno_votado.apellidos,
              };

              this.arrayAlumnos.push(x);
            });
        });

        this.cargarEscalas();
        this.inicializarArrays();
      })
  }

  inicializarArrays() {
    this.arrayVotaciones = [...new Array(this.arrayAlumnos.length)].map(
      (_, i) => {
        const obj = {
          alumno_votado: this.arrayAlumnos[i].id,
          escala: '',
          valor: '-1',
        };
        return obj;
      }
    );

    this.guardarVacio = [...new Array(this.arrayCriterios.length)].map(
      (_, i) => {
        return {
          criterio: this.arrayCriterios[i].id,
          votaciones: JSON.parse(JSON.stringify(this.arrayVotaciones)),
        };
      }
    );
  }

  cargarEscalas() {
    console.log('cargarEscalas');
    console.log(this.arrayCriterios);
    this.escalasPorCriterio = [];

    this.arrayCriterios.map((element) => {
      console.log('Element: ', element);

      this.criterioService.cargarEscalasPorCriterio(element.id)
        .subscribe(
          (res) => {
            console.log('Res (escalas): ', res, ' Element: ', element);

            const temp = {
              id: element.id,
              escalas: res['escalas'],
            };
            console.log('Objeto creado temp:', temp);
            this.escalasPorCriterio.push(temp);
          },
          (err) => {
            console.log('Error: ', err);
          }
      );
    });
  }

  seleccionar(
    dimension: any,
    posDimension: number,
    alumno: any,
    posAlumno: number,
    escala: any
  ) {
    this.guardarVacio[posDimension].votaciones[posAlumno].escala =
      escala.target.value;
    console.log(
      "Alumno: ",
      alumno,
      "Dimension: ",
      dimension,
      "Escala: ",
      escala.target.value
    );
    console.log("GuardarVacio:", this.guardarVacio);
  }
}

