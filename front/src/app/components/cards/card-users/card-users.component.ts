import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-users',
  templateUrl: './card-users.component.html'
})
export class CardUsersComponent implements OnInit {
  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaUsuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios(this.ultimaBusqueda);
  }

  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( res => {
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

}
