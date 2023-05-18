import { newArray } from "@angular/compiler/src/util";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Evaluacion } from "src/app/models/evaluacion.model";
import { Iteracion } from "src/app/models/iteracion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { GrupoService } from "src/app/services/grupo.service";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-iteracion-alu",
  templateUrl: "./iteracion.component.html",
})
export class IteracionAluComponent implements OnInit {
  evaluaciones: any;

  valores: Evaluacion[] = [];
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
  alumnos: [];

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
               private grupoService: GrupoService,
               private route: ActivatedRoute,
               private router: Router ) {}

  ngOnInit(): void {
    this.arrayCriterios = [];
    console.log(this.route.snapshot.params['uid']);
    this.id = this.route.snapshot.params['uid'];
    this.cargarIteracion();

    this.uidAlumno = localStorage.getItem('uid');
    this.cargarEvaluacion();
  }

  limpiarArrays() {
    this.evaluaciones = [];
    this.valores = [];
  }

  cargarIteracion() {
    this.iteracionService.cargarIteracion(this.id)
    .subscribe(res => {
      if (!res['iteracion']) {
        this.router.navigateByUrl('/alumno/coevaluacion/');
        return;
      };

      this.numIteracion = res['iteracion'].iteracion;
    })
  }

  cargarEvaluacion() {
    this.evaluacionService.getEvaluationByStudent(this.uidAlumno, this.id)
      .subscribe(res => {
        console.log('cargarEvaluacion ', res);
        this.evaluaciones = res['evaluaciones'];

        // this.cargarCriterios(res['evaluaciones'][0].valores);
        if(res['evaluaciones'].length === 0){

        }else{
          this.valores = res['evaluaciones'][0].valores;
        console.log("🚀 ~ file: iteracion.component.ts:98 ~ cargarEvaluacion ~ valores:", this.valores)
        // this.cargarCriterios();
        if(this.evaluaciones.length > 1){
          console.log('hola')
          // this.valores.map((_) => ({
          //   id: `${_.criterio._id}`,
          // }));
        }
        this.arrayCriterios = res['evaluaciones'][0].valores.map((_) => ({
          id: `${_.criterio._id}`,
        }));

        console.log('ARRAY CRITERIOS ',this.arrayCriterios);

        this.cargarEscalas();

        res['evaluaciones'][0].valores
          .map((item) => {
            this.arrayAlumnos = [];

            item.votaciones.map((_) => {

              const x = {
                id: _.alumno_votado._id,
                nombre:
                  _.alumno_votado.nombre + ' ' + _.alumno_votado.apellidos,
              };

              this.arrayAlumnos.push(x);
            });
        });


        this.inicializarArrays();
        this.cargarAlumnos();
        }
      },
      (err) => {
        console.log('Error: ', err);
      })
  }

  inicializarArrays() {
    if(this.arrayAlumnos){
      this.arrayVotaciones = [...new Array(this.arrayAlumnos.length)]
    .map(
      (_, i) => {
        const obj = {
          alumno_votado: this.arrayAlumnos[i].id,
          escala: '',
          valor: '-1',
        };
        return obj;
      }
    );
    }

    if(this.arrayCriterios){
      this.guardarVacio = [...new Array(this.arrayCriterios.length)].map(
        (_, i) => {
          return {
            criterio: this.arrayCriterios[i].id,
            votaciones: JSON.parse(JSON.stringify(this.arrayVotaciones)),
          };
        }
      );
    }
  }

  cargarCriterios() {
    // this.arrayCriterios = [];
    console.log('cargarCriterios');

    this.criterioService.cargarCriterios(0)
    .subscribe((res) => {
      if(!res['criterios']) return;
      console.log('SUBSCRIBE: ',res['criterios']);
      this.arrayCriterios = res['criterios'].map(element =>
        {
           if (element.uid)
           {
              const x = {
                id: `${element.uid}`
              }
              this.arrayCriterios.push(x);
           }
        }).filter(notUndefined => notUndefined !== undefined);

        const result = from(this.arrayCriterios);
        result.subscribe((x) => console.log(x));

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> result: ', result);
    });
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> arrayCriterios: ', this.arrayCriterios);

  }

  cargarEscalas() {
    console.log('cargarEscalas');
    console.log(this.arrayCriterios);
    this.escalasPorCriterio = [];

      console.log('Entra a cargarEscalasPorCriterio')
      // this.arrayCriterios.map((element) => {
        this.arrayCriterios.map((element) => {
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',element)
        this.criterioService.cargarEscalasPorCriterio(element.id)
          .subscribe(
            (res) => {
              const temp = {
                id: element.id,
                escalas: res['escalas'],
              };

              this.escalasPorCriterio.push(temp);
            },
            (err) => {
              console.log('Error: ', err);
            }
        );
      });
  }

  cargarAlumnos() {
    this.grupoService.getGrupoPorAlumno(this.uidAlumno)
    .subscribe(
      res => {
        this.alumnos = res['grupos'][0].alumnos;
        console.log('Grupossssssssssssssssssssssssssssss ',this.alumnos);
      }
    )
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

