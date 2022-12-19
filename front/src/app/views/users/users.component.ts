import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { Curso } from 'src/app/models/curso.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaUsuarios: Usuario[] = [];
  public cursos: Curso[] = [];

  constructor(private usuarioService: UsuarioService,
              private cursoService: CursoService,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarUsuarios(this.ultimaBusqueda);
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursoService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( res => {
        console.log(res['usuarios']);
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['usuarios'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarUsuarios(this.ultimaBusqueda);
          } else {
            this.listaUsuarios = [];
            this.totalusuarios = 0;
          }
        } else {
          this.listaUsuarios = res['usuarios'];
          console.log(this.listaUsuarios);
          this.totalusuarios = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarUsuarios(this.ultimaBusqueda);
  }

  eliminarUsuario(uid: string, nombre: string, apellidos: string) {
    // Comprobar que no me borro a mi mismo
    if (uid === this.usuarioService.uid) {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
      return;
    }
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar usuario',
      text: `Al eliminar al usuario '${nombre} ${apellidos}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.usuarioService.borrarUsuario(uid)
              .subscribe( resp => {
                this.cargarUsuarios(this.ultimaBusqueda);
                Swal.fire({
                  title: 'Usuario eliminado',
                  text: 'El usuario se ha eliminado correctamente',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  allowOutsideClick: false
                });
                this.router.navigateByUrl('/admin/users/');
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                //console.warn('error:', err);
              })
          }
      });
  }

}
