import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IteracionService } from 'src/app/services/iteracion.service';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso.model';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-iteracion',
  templateUrl: './iteracion.component.html'
})
export class IteracionComponent implements OnInit {

  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    hito: ['', Validators.required ],
    iteracion: ['', Validators.required ],
    curso: ['', Validators.required ],
    fecha_ini: ['', Validators.required ],
    fecha_fin: ['', Validators.required ],
    fecha_ini_coe: ['', Validators.required ],
    fecha_fin_coe: ['', Validators.required ],
  });

  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  public alumnos: string[];

  constructor(private fb: FormBuilder,
              private iteracionService: IteracionService,
              private cursosService: CursoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos();

    if(this.uid === 'nuevo'){
      this.nombre = true;
      this.datosForm.reset();
    }
  }


  enviar() {
    console.log('Entra')
    this.submited = true;
    console.log(this.datosForm)
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.iteracionService.crearIteracion( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['iteracion'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nueva Iteración',
            text: 'La iteracion' + res['iteracion'].iteracion + ' ha sido creado correctamente',
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
      this.iteracionService.actualizarIteracion(this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Iteración modificada',
            text: 'La iteración se ha modificado correctamente',
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
      this.iteracionService.cargarIteracion(this.uid)
        .subscribe( res => {
          if (!res['iteraciones']) {
            this.router.navigateByUrl('/admin/iteraciones');
            return;
          };
          this.datosForm.get('iteracion').setValue(res['iteraciones'].iteracion);
          this.datosForm.get('hito').setValue(res['iteraciones'].hito);
          this.datosForm.get('curso').setValue(res['iteraciones'].curso._id);
          this.datosForm.get('fecha_ini').setValue(moment(res['iteraciones'].fecha_ini).format('YYYY-MM-DD'));
          this.datosForm.get('fecha_fin').setValue(moment(res['iteraciones'].fecha_fin).format('YYYY-MM-DD'));
          this.datosForm.get('fecha_ini_coe').setValue(moment(res['iteraciones'].fecha_ini_coe).format('YYYY-MM-DD'));
          this.datosForm.get('fecha_fin_coe').setValue(moment(res['iteraciones'].fecha_fin_coe).format('YYYY-MM-DD'));
          this.datosForm.markAsPristine();
          this.uid = res['iteraciones'].uid;
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/iteraciones');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('iteracion').setValue('');
      this.datosForm.get('hito').setValue('');
      this.datosForm.get('curso').setValue('');
      this.datosForm.get('fecha_ini').setValue('');
      this.datosForm.get('fecha_fin').setValue('');
      this.datosForm.get('fecha_ini_coe').setValue('');
      this.datosForm.get('fecha_fin_coe').setValue('');
      this.datosForm.markAsPristine();
    }
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
  }

  cancelar() {
    this.router.navigateByUrl('/admin/iteraciones');
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

  cargarCursos() {
    // cargamos todos los cursos
    this.cursosService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

}
