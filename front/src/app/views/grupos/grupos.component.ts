import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Curso } from 'src/app/models/curso.model';
import { Grupo } from 'src/app/models/grupo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html'
})
export class GruposComponent implements OnInit, OnDestroy {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Ultima búsqueda
  public ultimaBusqueda = '';
  public listaRegistros: Grupo[] = [];

  public cursos: Curso[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$;

  constructor( private fb: FormBuilder,
               private cursoService: CursoService,
               private grupoService: GrupoService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarGrupos(this.ultimaBusqueda);
    this.subs$ = this.buscarForm.valueChanges
      .subscribe( event => {
        this.cargarGrupos(this.ultimaBusqueda);
      });
  }

  cargarGrupos(texto:string) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    const curso = this.buscarForm.get('curso').value;
    this.grupoService.listaAsignaturas(this.registroactual, texto, curso)
      .subscribe( res => {
        console.log(res);
        this.listaRegistros = res['grupos'];
        this.totalregistros = res['page'].total;
        this.loading = false;
      }, (erro) => {

      });
  }

  eliminarGrupo(uid:string, nombre:string) {
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
            this.grupoService.eliminarGrupo(uid)
              .subscribe( resp => {
                this.cargarGrupos(this.ultimaBusqueda);
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursoService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarGrupos(this.ultimaBusqueda);
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarGrupos(this.ultimaBusqueda);
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

}
