import { Component, OnInit } from '@angular/core';
import { IteracionService } from 'src/app/services/iteracion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iteraciones',
  templateUrl: './iteraciones.component.html'
})
export class IteracionesComponent implements OnInit {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Iteraciones lsitado
  public listaRegistros: [] = [];
  // Ultima búsqueda
  public ultimaBusqueda = '';

  constructor(private iteracionService: IteracionService,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarIteraciones(this.ultimaBusqueda);
  }

  cargarIteraciones( texto: string ) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    this.iteracionService.cargarIteraciones(this.registroactual, texto)
      .subscribe(res => {
        console.log(res['iteraciones'])
        if (res['iteraciones'].length === 0) {
          if (this.registroactual > 0) {
            this.registroactual -= this.registrosporpagina;
            if (this.registroactual < 0) { this.registroactual = 0};
            this.cargarIteraciones(this.ultimaBusqueda);
          } else {
            this.listaRegistros = [];
            this.totalregistros = 0;
          }
        } else {
          this.listaRegistros = res['iteraciones'];
          this.totalregistros = res['page'].total;
        }
        this.loading = false;
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
        this.loading = false;
      });
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarIteraciones(this.ultimaBusqueda);
  }

  eliminarIteracion( uid: string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar iteracion',
      text: `Al eliminar la iteracion se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.iteracionService.eliminarIteracion(uid)
              .subscribe( resp => {
                this.cargarIteraciones(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }


}
