import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { RubricaService } from 'src/app/services/rubrica.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CriterioService } from 'src/app/services/criterio.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Curso } from 'src/app/models/curso.model';
import { Rubrica } from 'src/app/models/rubrica.model';
import Swal from 'sweetalert2';
import { Criterio } from 'src/app/models/criterio.model';

@Component({
  selector: 'app-rubricas',
  templateUrl: './rubricas.component.html'
})
export class RubricasComponent implements OnInit {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;

  public listaRegistros: Rubrica[] = [];
  public criterios: Criterio [] = [];
  public listaCriterios: Criterio[] = [];
  public cursos: Curso[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$;

  constructor( private fb: FormBuilder,
               private cursoService: CursoService,
               private rubricaService: RubricaService,
               private criterioService: CriterioService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // this.cargarCriterios();
    // this.cargarCursos();
    this.cargarRubricas();
    this.subs$ = this.buscarForm.valueChanges
      .subscribe( event => {
        this.cargarRubricas();
      });
  }

  cargarRubricas() {
    this.loading = true;
    const curso = this.buscarForm.get('curso').value;
    const texto = this.buscarForm.get('texto').value || '';
    this.rubricaService.listaRubricas( this.registroactual, texto, curso)
      .subscribe( res => {
        console.log(res);
        this.listaRegistros = res['rubricas'];

        // this.criterios = this.listaRegistros;
        this.totalregistros = res['page'].total;
        this.loading = false;
      }, (erro) => {

      });
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursoService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  eliminarRubrica(uid:string, nombre:string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar rúbrica',
      text: `Al eliminar la rúbrica se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.rubricaService.eliminarRubrica(uid)
              .subscribe( resp => {
                this.cargarRubricas();
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }

  // cargarCriterios() {
  //   // cargamos todos los cursos
  //   this.criterioService.cargarCriterios(0, '')
  //     .subscribe( res => {
  //       this.criterios = res['criterios'];
  //     });
  // }

  borrar() {
    this.buscarForm.reset();
    this.cargarRubricas();
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarRubricas();
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

}
