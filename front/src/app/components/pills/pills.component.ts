import { Component, OnInit, Input } from "@angular/core";
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from "src/app/services/asignatura.service";
import { Curso } from "src/app/models/curso.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pills',
  templateUrl: './pills.component.html'
})
export class PillsComponent implements OnInit {

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    nombrecorto: ['', Validators.required ],
    curso: ['', Validators.required ],
  });
  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  @Input()
  get statTitle(): string {
    return this._statTitle;
  }
  set statTitle(statTitle: string) {
    this._statTitle = statTitle === undefined ? "Asignar profesores" : statTitle;
  }
  private _statTitle = "Asignar profesores";

  @Input()
  get statSubtitle(): string {
    return this._statSubtitle;
  }
  set statSubtitle(statSubtitle: string) {
    this._statSubtitle = statSubtitle === undefined ? "Matricular alumnos" : statSubtitle;
  }
  private _statSubtitle = "Matricular alumnos";

  public profesores: string[] = [];
  public alumnos: string[] = [];

  constructor(private fb: FormBuilder,
              private asignaturaService: AsignaturaService,
              private router: Router) { }

  ngOnInit(): void {
  }

  openTab = 1;
  toggleTabs($tabNumber: number){
    console.log('Hi')
    this.openTab = $tabNumber;
  }

  cargarDatos( uid: string ) {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.asignaturaService.cargarAsignatura(this.uid)
        .subscribe( res => {
          if (!res['asignaturas']) {
            this.router.navigateByUrl('/admin/asignaturas');
            return;
          };
          this.datosForm.get('nombre').setValue(res['asignaturas'].nombre);
          this.datosForm.get('nombrecorto').setValue(res['asignaturas'].nombrecorto);
          this.datosForm.get('curso').setValue(res['asignaturas'].curso._id);
          this.datosForm.markAsPristine();
          this.uid = res['asignaturas'].uid;
          this.submited = true;
          this.profesores = res['asignaturas'].profesores;
          this.alumnos = res['asignaturas'].alumnos;
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo'});
          return;
        });
    } else {
      this.nuevo();
    }
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
    this.datosForm.get('nombre').setValue('');
    this.datosForm.get('nombrecorto').setValue('');
    this.datosForm.get('curso').setValue('');
    this.datosForm.markAsPristine();
    this.profesores= [];
    this.alumnos = [];
  }

  guardarLista( evento: string[], tipo: string) {
    this.asignaturaService.actualizarListas(this.uid, evento, tipo)
      .subscribe( res => {
        console.log('Llama función guardarLista');
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, inténtelo más tarde'});
        return;
      });
  }
}
