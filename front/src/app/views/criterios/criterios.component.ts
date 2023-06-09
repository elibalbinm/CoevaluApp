import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CriterioService } from 'src/app/services/criterio.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Curso } from 'src/app/models/curso.model';
import { Criterio } from 'src/app/models/criterio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criterios',
  templateUrl: './criterios.component.html'
})
export class CriteriosComponent implements OnInit {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;

  public listaRegistros: Criterio[] = [];
  public rol: string = '';
  public cursos: Curso[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$;

  constructor( private fb: FormBuilder,
               private cursoService: CursoService,
               private criterioService: CriterioService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.rol = this.usuarioService.rol;
    this.cargarCriterios();
    this.subs$ = this.buscarForm.valueChanges
      .subscribe( event => {
        this.cargarCriterios();
      });
  }

  cargarCriterios() {
    this.loading = true;
    const curso = this.buscarForm.get('curso').value;
    const texto = this.buscarForm.get('texto').value || '';
    this.criterioService.listaAsignaturas( this.registroactual, texto, curso )
      .subscribe( res => {
        this.listaRegistros = res['criterios'];
        this.totalregistros = res['page'].total;
        this.loading = false;
      }, (erro) => {

      });
  }

  eliminarCriterio(uid:string, nombre:string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar criterio',
      text: `Al eliminar el criterio '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.criterioService.eliminarCriterio(uid)
              .subscribe( resp => {
                this.cargarCriterios();
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarCriterios();
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarCriterios();
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

}
