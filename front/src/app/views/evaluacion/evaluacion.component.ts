import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { CriterioService } from 'src/app/services/criterio.service';
import { Criterio } from 'src/app/models/criterio.model';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html'
})
export class EvaluacionComponent implements OnInit {
  [x: string]: any;

  constructor(private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private criterioService: CriterioService,
    private route: ActivatedRoute,
    private router: Router) { }

  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    alumno: ['', Validators.required ],
    votaciones: this.fb.group({
      alumno: ['', Validators.required],
      valores: this.fb.array([]) // create empty form array
    }),
    iteracion: ['', Validators.required ],
    criterio: ['', Validators.required ],
    escala: ['', Validators.required ],
    valor: ['', Validators.required ],
    // alumno_votado: ['', Validators.required ],
    fecha: ['', Validators.required ]
  });

  public criterios: Criterio[] = [];

  public submited = false;
  public uid: string = 'nuevo';
  public valores: {criterio: '', escala: '', valor: ''}
  public alumnos: string[];
  public votaciones: any;

  ngOnInit(): void {
    this.control = <FormArray>this.datosForm.controls['votaciones.valores'];
    this.cargarCriterios();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos();

    if(this.uid === 'nuevo'){
      this.nombre = true;
      this.datosForm.reset();
    }
  }

  //Funcion para obtener los valores del form y utilizarlo en actualizar Evaluacion
  patch(usuario: any, votaciones: any) {
    // const alumno = this.datosForm.get('votaciones.usuario');
    this.control = <FormArray>this.datosForm.get('votaciones.valores');
    console.log('Usuarioooooooo: ', usuario);
    // this.datosForm.get('votaciones.usuario').setValue(usuario._id);
    votaciones.forEach(x => {
      this.control.push(this.patchValues(x.criterio._id, x.escala._id, x.valor))
    });
    console.log(this.control);

    console.log('Votaciones>valores ',this.datosForm.get('votaciones.valores').value);
  }

  // Assign the values
  patchValues(criterio, escala, valor) {
    return this.fb.group({
      criterio: criterio,
      escala: escala,
      valor: valor
    })
  }

  cargarCriterios() {
    this.criterioService.cargarCriterios(0, '')
      .subscribe( res => {
        console.log('Criterios',res['criterios'])
        this.criterios = res['criterios'];
      });
  }

  enviar() {
    console.log('Entra')
    this.submited = true;

    //Asignamos los valores de Alumno, Criterio, Escala al campo de Votaciones
    var objeto={ "usuario":["a0","b0","c0"],"arr_1":["a1","b1","c1"] };
    const votaciones = [
      {
        usuario: "John"
      },
      {
        name: "Margarita",
        lastName: "Gonzales",
      }
    ];
    this.datosForm.get('votaciones').setValue(this.votaciones);

    console.log(this.datosForm)

    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {



      this.evaluacionService.crearEvaluacion( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['evaluacion'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nueva Evaluación',
            text: 'La evaluacion ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.evaluacionService.actualizarEvaluacion(this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Evaluación modificada',
            text: 'La evaluación se ha modificado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }
  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.evaluacionService.cargarEvaluacion(this.uid)
        .subscribe( res => {
          if (!res['evaluaciones']) {
            this.router.navigateByUrl('/admin/evaluaciones');
            return;
          };
          console.log(res['evaluaciones'])
          this.datosForm.get('alumno').setValue(res['evaluaciones'].alumno.nombre);
          this.datosForm.get('iteracion').setValue(res['evaluaciones'].iteracion.iteracion);
          this.datosForm.get('fecha').setValue(moment(res['evaluaciones'].fecha).format('YYYY-MM-DD'));
          //------------------------------------------------------------------------------------------------
          // this.datosForm.get('alumno_votado').setValue(res['evaluaciones'].votaciones[0].usuario.nombre);
          console.log('ID de Criterio: ',res['evaluaciones'].votaciones[0].valores[0].criterio._id)
          this.datosForm.get('criterio').setValue(res['evaluaciones'].votaciones[0].valores[0].criterio._id);
          this.datosForm.get('escala').setValue(res['evaluaciones'].votaciones[0].valores[0].escala.nivel);
          this.datosForm.get('valor').setValue(res['evaluaciones'].votaciones[0].valores[0].valor);
          this.datosForm.get('votaciones.alumno').setValue(res['evaluaciones'].votaciones[0].usuario._id);
          //------------------------------------------------------------------------------------------------
          this.patch(res['evaluaciones'].votaciones[0].usuario, res['evaluaciones'].votaciones[0].valores);
          //-------------------------------------------------------------------------------------------------
          this.datosForm.markAsPristine();
          this.uid = res['evaluaciones'].uid;
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/evaluaciones');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('alumno').setValue('');
      this.datosForm.get('iteracion').setValue('');
      this.datosForm.get('fecha').setValue('');
      this.datosForm.get('criterio').setValue('');
      //----------------------------Votaciones-------------------------------
      // Estructura JSON:
      //   "votaciones": [
      //     {
      //         "usuario": "630c9347d606db2c207f90de",
      //         "valores": [
      //             {
      //                 "criterio": "6315a81675458a8204bcaa8d",
      //                 "escala": "6315c78d1d17db1bd02f654c",
      //                 "valor": "3"
      //             },
      //             {
      //                 "criterio": "6315a939c65de41520e57e7e",
      //                 "escala": "6315c7c91d17db1bd02f654d",
      //                 "valor": "2"
      //             }
      //         ]
      //     }
      // ]

      let nombres = [];
      let valores = [];
      // this.listaProyectos = JSON.parse(JSON.stringify(res['proyectos']));
      // this.totalproyectos = res['page'].total;
      // for(let entry of this.listaProyectos){
      //   nombres = [];
      //   for(let i of entry.clientes){
      //     nombres.push(i[0]);
      //   }
      //   entry.clientes = nombres;
      // }
      //--------------------------------------------------------------------
      this.datosForm.markAsPristine();
    }
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
  }

  cancelar() {
    this.router.navigateByUrl('/admin/evaluaciones');
  }

  campoNoValido(campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  esnuevo(): boolean {
    if (this.uid === 'nuevo') {
      // this.datosForm.reset();
      return true; }
    return false;
  }

}
