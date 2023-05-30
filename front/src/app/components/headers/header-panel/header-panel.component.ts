import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import Swal from 'sweetalert2';
import {UsuarioService} from "../../../services/usuario.service";

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html'
})
export class HeaderPanelComponent implements OnInit {
  public cursos: Curso[] = [];
  public cursoActual: string = '';

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    nombrecorto: ['', Validators.required ],
    curso: ['', Validators.required ],
  });

  constructor( private cursoService: CursoService,
               private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.cursoActual = localStorage.getItem('cursoUid');
    console.log('Curso actual :',localStorage.getItem('cursoUid'));
  }

  cargarCursos() {
    this.cursoService.cargarCursos(0)
    .subscribe(res => {
      this.cursos = res['cursos'];
    }, (err)=> {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
    });
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid;
  }

}
