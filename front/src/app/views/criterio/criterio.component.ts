import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CriterioService } from 'src/app/services/criterio.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Curso } from 'src/app/models/curso.model';
import { Criterio } from 'src/app/models/criterio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criterio',
  templateUrl: './criterio.component.html'
})
export class CriterioComponent implements OnInit {

  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    descripcion: ['', Validators.required ],
    activo: [true, Validators.required ],
  });

  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  public alumnos: string[];

  constructor(private fb: FormBuilder,
              private criterioService: CriterioService,
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
      this.criterioService.crearCriterio( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['criterio'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nuevo Criterio',
            text: 'El criterio' + res['criterio'].nombre + ' ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          this.router.navigateByUrl('/admin/criterios');
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.criterioService.actualizarCriterio( this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }

  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.criterioService.cargarCriterio(this.uid)
        .subscribe( res => {
          if (!res['criterios']) {
            this.router.navigateByUrl('/admin/criterios');
            return;
          };
          this.datosForm.get('nombre').setValue(res['criterios'].nombre);
          this.datosForm.get('descripcion').setValue(res['criterios'].descripcion);
          this.datosForm.get('activo').setValue(res['criterios'].activo);
          this.datosForm.markAsPristine();
          this.uid = res['criterios'].uid;
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/criterios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('nombre').setValue('');
      this.datosForm.get('descripcion').setValue('');
      this.datosForm.get('activo').setValue('');
      this.datosForm.markAsPristine();
    }
  }

  guardarLista( evento: string[]) {
    console.log('guardamos lista',this.uid);
    this.criterioService.actualizarLista(this.uid, evento)
      .subscribe( res => {
      },(err)=>{
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Ocurrió un error, inténtelo más tarde',});
        return;
      });
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/criterios');
    } else {
      this.cargarDatos();
    }
  }

  campoNoValido( campo: string) {
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
