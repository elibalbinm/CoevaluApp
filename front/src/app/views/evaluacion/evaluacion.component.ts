import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { CriterioService } from 'src/app/services/criterio.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Escala } from 'src/app/models/escala.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
})
export class EvaluacionComponent implements OnInit {
  public nombre = false;
  public uid: string = 'nuevo';
  public valores;
  public keys;
  public alumnos;
  public evaluaciones: Evaluacion[] = [];
  public escalas: Escala[] = [];
  public datosForm = this.fb.group({
    uid: [{ value: 'nuevo', disabled: true }, Validators.required],
    hito: ['', Validators.required],
    iteracion: ['', Validators.required],
    curso: ['', Validators.required],
    fecha_ini: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    fecha_ini_coe: ['', Validators.required],
    fecha_fin_coe: ['', Validators.required],
  });

  escalaId: any;
  submited: boolean = false;
  arrayCriterios: any;
  arrayCriteriosPorEscala: any;
  arrayAlumnos: any;
  escalasPorCriterio: any;
  arrayVotaciones: { alumno_votado: string; escala: string; valor: string }[];
  guardarVacio: { criterio: string; votaciones: any }[];
  // escalas: any;

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private route: ActivatedRoute,
    private criterioService: CriterioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.cargarDatos();
    if (this.uid === 'nuevo') this.nombre = true;
  }

  nuevo() {
    this.uid = 'nuevo';
    this.submited = false;
  }

  cancelar() {
    this.router.navigateByUrl('/admin/evaluaciones');
  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.evaluacionService.cargarEvaluacion(this.uid).subscribe(
        (res) => {
          console.log(res);
          if (!res['evaluaciones']) {
            this.router.navigateByUrl('/admin/iteraciones');
            return;
          }

          this.evaluaciones = res['evaluaciones'].valores;
          console.log('Evaluaciones (valores): ', this.evaluaciones);

          this.arrayCriterios = res['evaluaciones'].valores.map((_) => ({
            id: `${_.criterio._id}`,
          }));

          res['evaluaciones'].valores.map((item, index) => {
            this.arrayAlumnos = [];
            console.log(
              '>>>>>>>>>>>>>>>>>>>>>>>>>> ',
              item.votaciones.alumno_votado
            ),
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
          console.log('++++++++++++++++++++++++++++++', this.arrayAlumnos);
          console.log('Array criteriosssssssss ', this.arrayCriterios);

          this.cargarEscalas();
          this.inicializarArrays();
          console.log('Iniciando guardar:', this.guardarVacio);
          this.submited = true;
        },
        (err) => {
          this.router.navigateByUrl('/admin/evaluaciones');
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo completar la acción, vuelva a intentarlo',
          });
          return;
        }
      );
    } else {
    }
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

  objectKeys(objeto: any) {
    this.keys = Object.keys(objeto);
    console.log(this.keys); // echa un vistazo por consola para que veas lo que hace 'Object.keys'
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
      'Alumno:',
      alumno,
      'dimension:',
      dimension,
      ' Escala:',
      escala.target.value
    );
    console.log('GuardarVacio:', this.guardarVacio);
  }

  enviarDatos() {
    console.log('Entro a enviarDatos');
    let completo = true;

    this.guardarVacio.forEach((element) => {
      element.votaciones.forEach((votacion: any) => {
        console.log('guardarVacio: ', this.guardarVacio);
        if (votacion.escala === '') {
          completo = false;
        }
      });
    });

    if (!completo) console.log('No puedes modificar, faltan datos');
    else {
      this.evaluacionService
        .actualizarVotacion(this.uid, this.guardarVacio)
        .subscribe(
          (res) => {
            console.log('Se ha suscrito correctamente: ', res);
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error, inténtelo más tarde',
            });
            return;
          }
        );
    }
  }

  // Funcion que a partir de un criterio dado, busca en la BBDD todos los posibles niveles que dispone
  // y los almacena en un array
  cargarEscalas() {
    console.log('cargarEscalas');
    console.log(this.arrayCriterios);
    this.escalasPorCriterio = [];

    this.arrayCriterios.map((element) => {
      console.log('Element: ', element);

      this.criterioService.cargarEscalasPorCriterio(element.id).subscribe(
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
}
