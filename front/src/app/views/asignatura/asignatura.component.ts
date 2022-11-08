import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html'
})
export class AsignaturaComponent implements OnInit {
  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    nombrecorto: ['', Validators.required ],
    porcentaje: ['', Validators.required ],
    curso: ['', Validators.required ],
  });
  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  public profesores: string[] = [];
  public alumnos: string[] = [];

  public tab = 1;

  constructor(private fb: FormBuilder,
              private asignaturaService: AsignaturaService,
              private cursosService: CursoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos(this.uid);

    if(this.uid === 'nuevo'){
      this.nombre = true;
      this.datosForm.reset();
    }

  }

  cargarDatos( uid: string ) {
    console.log(uid);
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.asignaturaService.cargarAsignatura(this.uid)
        .subscribe( res => {
          if (!res['asignaturas']) {
            this.router.navigateByUrl('/admin/asignaturas');
            return;
          };
          this.datosForm.get('nombre').setValue(res['asignaturas'].nombre);
          this.datosForm.get('nombrecorto').setValue(res['asignaturas'].nombrecorto);
          this.datosForm.get('curso').setValue(res['asignaturas'].curso._id);
          this.datosForm.get('porcentaje').setValue(res['asignaturas'].porcentaje);
          this.datosForm.markAsPristine();
          this.uid = res['asignaturas'].uid;
          this.submited = true;
          this.profesores = res['asignaturas'].profesores;
          this.alumnos = res['asignaturas'].alumnos;
        }, (err) => {
          this.router.navigateByUrl('/admin/asignaturas');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo'});
          return;
        });
    } else {
      this.nuevo();
    }
  }

  enviar() {
    console.log('Entra a enviar()')
    this.submited = true;
    console.log(this.datosForm)
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.asignaturaService.crearAsignatura( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['asignatura'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nueva Asignatura',
            text: 'La asignatura ' + res['asignatura'].nombre + ' ha sido creada correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          // this.asignaturaService.
          this.datosForm.reset();
          this.router.navigateByUrl('/admin/asignaturas/asignatura/' + this.uid);
          // this.router.navigateByUrl('/admin/asignaturas/');
          // this.route.snapshot.params['uid'] = this.uid;
          // console.log(this.uid);
          // this.asignaturaService.newID(JSON.stringify(res['asignatura'].uid));
          // console.log(this.asignaturaService.uid);

        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.asignaturaService.actualizarAsignatura( this.uid, this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }

  }

  nuevo() {
    this.nombre = true;
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
    this.datosForm.get('nombre').setValue('');
    this.datosForm.get('nombrecorto').setValue('');
    this.datosForm.get('curso').setValue('');
    this.datosForm.markAsPristine();
    this.profesores = [];
    this.alumnos = [];
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/asignaturas');
    } else {
      this.cargarDatos(this.uid);
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  esnuevo(): boolean {
    if (this.uid === 'nuevo') { return true; }
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
