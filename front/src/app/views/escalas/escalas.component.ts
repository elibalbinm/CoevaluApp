import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Criterio } from 'src/app/models/criterio.model';
import { Escala } from 'src/app/models/escala.model';
import { CriterioService } from 'src/app/services/criterio.service';
import { EscalaService } from 'src/app/services/escala.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escalas',
  templateUrl: './escalas.component.html'
})
export class EscalasComponent implements OnInit {
  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Ultima búsqueda
  public ultimaBusqueda = '';

  public listaRegistros: Escala[] = [];

  public criterios: Criterio[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });

  constructor( private fb: FormBuilder,
               private escalaService: EscalaService,
               private criterioService: CriterioService) { }

  ngOnInit(): void {
    this.cargarCriterios();
    this.cargarEscalas(this.ultimaBusqueda);
  }

  cargarCriterios() {
    this.criterioService.cargarCriterios(0, '')
      .subscribe( res => {
        console.log(res);
        this.criterios = res['criterios'];
      });
  }

  cargarEscalas( texto: string ) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    this.escalaService.cargarEscalas(this.registroactual, texto)
      .subscribe(res => {
        if (res['escalas'].length === 0) {
          if (this.registroactual > 0) {
            this.registroactual -= this.registrosporpagina;
            if (this.registroactual < 0) { this.registroactual = 0};
            this.cargarEscalas(this.ultimaBusqueda);
          } else {
            this.listaRegistros = [];
            this.totalregistros = 0;
          }
        } else {
          this.listaRegistros = res['escalas'];
          this.totalregistros = res['page'].total;
        }
        this.loading = false;
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
        this.loading = false;
      });
  }
}
