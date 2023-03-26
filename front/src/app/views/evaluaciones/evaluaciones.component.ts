import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Curso } from 'src/app/models/curso.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html'
})
export class EvaluacionesComponent implements OnInit {

  constructor( private fb: FormBuilder,
    private cursoService: CursoService,
    private evaluacionService: EvaluacionService,
    private usuarioService: UsuarioService) { }

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public ultimaBusqueda = '';
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;

  public listaRegistros: Evaluacion[] = [];

  public cursos: Curso[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });

  public subs$;

  ngOnInit(): void {
    this.cargarEvaluaciones(this.ultimaBusqueda);
  }

  // A partir del alumno, se hace un filtro de búsqueda para ver si dispone de más
  // criterios
  cargarCriteriosAlumno() {

  }

  cargarEvaluaciones(texto: string) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    this.evaluacionService.cargarEvaluaciones(this.registroactual, texto)
      .subscribe( res => {
        console.log(res['evaluaciones'])
        if (res['evaluaciones'].length === 0) {
          if (this.registroactual > 0) {
            this.registroactual -= this.registrosporpagina;
            if (this.registroactual < 0) { this.registroactual = 0};
            this.cargarEvaluaciones(this.ultimaBusqueda);
          } else {
            this.listaRegistros = [];
            this.totalregistros = 0;
          }
        } else {
          this.listaRegistros = res['evaluaciones'];
          this.totalregistros = res['page'].total;
        }
        this.loading = false;
      }, (erro) => {

      });
  }

  cambiarPagina( pagina: number ) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarEvaluaciones(this.ultimaBusqueda);
  }

  eliminarEvaluacion(uid:string, nombre:string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar grupo',
      text: `Al eliminar el grupo '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.evaluacionService.eliminarEvaluacion(uid)
              .subscribe( resp => {
                this.cargarEvaluaciones(this.ultimaBusqueda);
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }
}
