import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CriterioService } from 'src/app/services/criterio.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { IteracionService } from 'src/app/services/iteracion.service';
@Component({
  selector: 'app-iteracion-alu',
  templateUrl: './iteracion.component.html',
})
export class IteracionAluComponent implements OnInit {
  evaluaciones: any;

  valores: any;
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
  alumnos: any;

  evaluacion: any;

  id: string = '';
  uidAlumno: string = '';
  numIteracion: string = '';

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== 'light' && color !== 'dark' ? 'light' : color;
  }
  private _color = 'light';

  constructor (private cd: ChangeDetectorRef,
               private iteracionService: IteracionService,
               private evaluacionService: EvaluacionService,
               private criterioService: CriterioService,
               private grupoService: GrupoService,
               private route: ActivatedRoute,
               private router: Router ) {}

  async ngOnInit() {
    // Inicializamos valores
    this.id = this.route.snapshot.params['uid'];
    this.uidAlumno = localStorage.getItem('uid');
    this.cargarIteracion();
    this.arrayCriterios = await this.cargarCriterios();
    console.log('ArrayCriterios: ', this.arrayCriterios);
    this.alumnos = await this.cargarAlumnos();
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
          console.log('(1) Array criterios sin evaluaciones: ',this.arrayCriterios)
          console.log('(1) Array alumnos sin evaluaciones: ',this.alumnos)
          this.alumnos.forEach( (item, index) => {
            if(item.usuario._id === this.uidAlumno) this.alumnos.splice(index,1);
          });
          console.log('(2): ', this.alumnos);
          let criterios = this.arrayCriterios
            .map((item, index) => ({
                criterio: item.criterio
            }));
          console.log('Valoresssssssssssssssss ',this.valores);
          console.log('ALumnos: ',this.alumnos);

          const votaciones = this.alumnos
            .map(_ => {
                const obj = {
                  alumno_votado: _.usuario,
                  escala: '',
                  valor: '-1',
                };
                return obj;
            });

          console.log('Votacionessssssssss', votaciones);

          console.log('(3) VALORES: ', {...criterios, ...votaciones});
          this.valores = criterios.map((obj, idx) => {
            return {...obj, votaciones: [...votaciones]};
          })
          console.log(this.valores);
        }else{
          this.valores = res['evaluaciones'][0].valores;
          console.log('🚀 ~ file: iteracion.component.ts:98 ~ cargarEvaluacion ~ valores:', this.valores)
          // this.cargarCriterios();

          // this.arrayCriterios = res['evaluaciones'][0].valores.map((_) => ({
          //   id: `${_.criterio._id}`,
          // }));

          console.log('ARRAY CRITERIOS ',this.arrayCriterios);

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
    return this.criterioService.cargarValoresPorIteracion(this.id).then(data => data['valores']);
  }

  cargarAlumnos() {
    return this.grupoService.getGrupoPorAlumno(this.uidAlumno);
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

      console.log('Escalas por criterio: ',this.escalasPorCriterio)
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
      'Alumno: ',
      alumno,
      'Dimension: ',
      dimension,
      'Escala: ',
      escala.target.value
    );
    console.log('GuardarVacio:', this.guardarVacio);
  }
}

