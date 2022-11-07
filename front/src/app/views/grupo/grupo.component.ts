import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CursoService } from 'src/app/services/curso.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html'
})
export class GrupoComponent implements OnInit {

  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    proyecto: ['', Validators.required ],
    curso: ['', Validators.required ],
  });

  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  public alumnos: string[];

  constructor(private fb: FormBuilder,
              private grupoService: GrupoService,
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
      this.grupoService.crearGrupo( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['grupo'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nuevo Grupo',
            text: 'El grupo' + res['grupo'].nombre + ' ha sido creado correctamente',
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
      this.grupoService.actualizarGrupo( this.uid, this.datosForm.value)
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
      this.grupoService.cargarGrupo(this.uid)
        .subscribe( res => {
          if (!res['grupos']) {
            this.router.navigateByUrl('/admin/grupos');
            return;
          };
          this.datosForm.get('nombre').setValue(res['grupos'].nombre);
          this.datosForm.get('proyecto').setValue(res['grupos'].proyecto);
          this.datosForm.get('curso').setValue(res['grupos'].curso._id);
          this.datosForm.markAsPristine();
          this.uid = res['grupos'].uid;
          this.submited = true;
          this.alumnos = res['grupos'].alumnos;
        }, (err) => {
          this.router.navigateByUrl('/admin/grupos');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('nombre').setValue('');
      this.datosForm.get('proyecto').setValue('');
      this.datosForm.get('curso').setValue('');
      this.datosForm.markAsPristine();
      this.alumnos = [];
    }
  }

  guardarLista( evento: string[]) {
    console.log('guardamos lista',this.uid);
    this.grupoService.actualizarLista(this.uid, evento)
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
      this.router.navigateByUrl('/admin/grupos');
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
