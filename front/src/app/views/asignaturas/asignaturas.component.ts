import { Component, OnInit, OnDestroy } from '@angular/core';
import { Asignatura } from 'src/app/models/asignatura.model';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder } from '@angular/forms';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso.model';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html'
})

export class AsignaturasComponent implements OnInit, OnDestroy {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Cursos lsitado
  public listaRegistros: Asignatura[] = [];
  // Ultima búsqueda
  public ultimaBusqueda = '';
  public rol: string = '';
  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$: Subscription;

  public cursos: Curso[] = [];

  constructor( private fb: FormBuilder,
               private cursosService: CursoService,
               private asigaturaService: AsignaturaService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.rol = this.usuarioService.rol;
    this.cargarCursos();
    this.cargarAsignaturas(this.ultimaBusqueda);
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarAsignaturas(this.ultimaBusqueda);
  }

  cargarAsignaturas(texto: string) {
    this.loading = true;
    this.ultimaBusqueda = texto;
    if(this.usuarioService.rol === "ROL_PROFESOR"){
      this.asigaturaService.listaMisAsignaturas(this.registroactual, texto)
      .subscribe(res => {
        this.listaRegistros = res['asignaturas'];
        this.totalregistros = res['page'].total;
      });
    }else{
      this.asigaturaService.listaAsignaturas(this.registroactual, texto)
      .subscribe( res => {
        this.listaRegistros = res['asignaturas'];
        this.totalregistros = res['page'].total;
      });
    }

    this.loading = false;
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursosService.cargarCursos(0, '','todos')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  eliminarAsignatura( uid: string, nombre: string ){
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar asignatura',
      text: `Al eliminar la asignatura '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.asigaturaService.eliminarAsignatura(uid)
              .subscribe( resp => {
                this.cargarAsignaturas(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });

  }

  cambiarPagina( pagina: number ) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarAsignaturas(this.ultimaBusqueda);
  }

  ngOnDestroy() {
    //this.subs$.unsubscribe();
  }

}
