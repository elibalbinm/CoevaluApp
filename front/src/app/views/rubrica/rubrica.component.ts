import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RubricaService } from 'src/app/services/rubrica.service';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Criterio } from 'src/app/models/criterio.model';
import { Curso } from 'src/app/models/curso.model';
import Swal from 'sweetalert2';

interface criteriaSelect{
  nombre: string;
  uid: string;
}

@Component({
  selector: 'app-rubrica',
  templateUrl: './rubrica.component.html'
})
export class RubricaComponent implements OnInit {

  public nombre = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    texto: ['', Validators.required ],
    curso: ['', Validators.required ],
    criterios: ['', Validators.required ],
    activo: [true, Validators.required ],
  });

  // Recibe una lista de criterios extraidos del modelo de Rubrica
  // Posee la siguiente estructura {_id: string, criterio: string}
  @Input() selected: {_id: string, criterio: string}[] = [];
  // Emite la lista de string de los criterios seleccionados
  @Output() nuevaLista:EventEmitter<string[]> = new EventEmitter();

  public listaSelected: criteriaSelect[] = [];
  public listaCriteria: criteriaSelect[] = [];
  public criterios: Criterio[] = [];
  public cursos: Curso[] = [];
  public submited = false;
  public uid: string = 'nuevo';
  public criteria: string[];

  constructor( private fb: FormBuilder,
               private rubricaService: RubricaService,
               private cursosService: CursoService,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {
    this.cargarCursos();
    console.log('Params: ' +this.route.snapshot.params['uid'])
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    console.log('Datos form: '+this.datosForm.get('uid').value)
    this.cargarDatos(this.uid);

    if(this.uid === 'nuevo'){
      this.nombre = true;
      this.datosForm.reset();
    }
  }

  ngOnChanges(): void{

    this.cargarCriteriosSeleccionados();
    this.cargarCriteriosSeleccionables();
  }

  ordenarLista(lista: criteriaSelect[]) {
    return lista.sort( (a, b): number => {
              const nombrea = a.nombre.toLowerCase();
              const nombreb = b.nombre.toLowerCase();
              if (nombrea > nombreb) { return 1; }
              if (nombrea < nombreb) { return -1; }
              return 0;
            });
  }

  agregarTodos() {
    while (this.listaCriteria.length>0) {
      this.agregar(0, false);
    }
    this.listaCriteria = this.ordenarLista(this.listaCriteria);
    this.evento();
  }

  quitarTodos() {
    while (this.listaSelected.length>0) {
      this.quitar(0, false);
    }
    this.listaSelected = this.ordenarLista(this.listaSelected);
    this.evento();
  }

  agregar(pos: number, evento?: boolean): void {
    if (pos < 0 || pos > this.listaCriteria.length) { return; }
    // Añadimos el elemento a seleccionado
    this.listaSelected.push(this.listaCriteria[pos]);
    this.selected.push({_id:'', criterio:this.listaCriteria[pos].uid});
    // Eliminamos el elemento de users
    this.listaCriteria.splice(pos, 1);
    this.listaSelected = this.ordenarLista(this.listaSelected);
    if (evento) {
      this.evento();
    }
  }

  quitar(pos: number, evento?: boolean): void {
    if (pos < 0 || pos > this.listaSelected.length) { return; }
    // Añadimos el elemento a criterios
    this.listaCriteria.push(this.listaSelected[pos]);

    // Eliminamos el elemento de users
    this.listaSelected.splice(pos, 1);
    // La lista que queda la volcamos en selected
    let local: {_id: string, criterio: string}[] = [];
    this.listaSelected.forEach(user => {
      local.push({_id:'', criterio: user.uid});
    });
    this.selected = local;
    this.listaCriteria = this.ordenarLista(this.listaCriteria);
    if (evento) {
      this.evento();
    }
  }

  cargarCriteriosSeleccionados(): void {
    if (this.selected === undefined) {
      this.listaSelected = [];
      return;
    }
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    this.selected.forEach(user => {
      selectedarray.push(user.criterio);
    });


    this.rubricaService.cargarListaCriterios( selectedarray )
        .subscribe( res => {
          this.listaSelected = [];
          res['rubricas']['criterios'].map( criterio => {
            this.listaSelected.push({nombre: `${criterio.apellidos}, ${criterio.nombre}` , uid: `${criterio.uid}`});
          });
        }, (err) => {
        });
  }

  cargarCriteriosSeleccionables(): void {
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    if (this.selected !== undefined) {

      this.selected.forEach(user => {
        selectedarray.push(user.criterio);
      });
    }

    this.rubricaService.cargarListaCriterios( selectedarray )
      .subscribe( res => {
        this.listaCriteria = [];
        res['usuarios'].map( usuario => {
          this.listaCriteria.push({nombre: `${usuario.nombre}`, uid: `${usuario.uid}`});
        });
      }, (err) => {
      });
  }

  listaUID(listaU: criteriaSelect[]): string[] {
    let lista: string[] = [];
    for (let index = 0; index < listaU.length; index++) {
      lista[index] = listaU[index].uid;
    }
    return lista;
  }

  evento() {
    this.nuevaLista.emit(this.listaUID(this.listaSelected));
  }

  cargarDatos( uid: string ) {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.rubricaService.cargarRubrica(this.uid)
        .subscribe( res => {
          if (!res['rubricas']) {
            this.router.navigateByUrl('/admin/rubricas');
            return;
          };
          console.log(res['rubricas']);
          this.datosForm.get('texto').setValue(res['rubricas'].texto);
          this.datosForm.get('curso').setValue(res['rubricas'].curso._id);
          this.datosForm.get('criterios').setValue(res['rubricas'].criterios._id);
          this.datosForm.get('activo').setValue(res['rubricas'].activo);
          this.datosForm.markAsPristine();
          this.uid = res['rubricas'].uid;
          this.criteria = res['rubricas'].criterios;
          this.submited = true;
          this.criterios = res['rubricas']['criterios'];
          console.log('Criterios: '+this.criterios)
        }, (err) => {
          this.router.navigateByUrl('/admin/rubricas');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('texto').setValue('');
      this.datosForm.get('curso').setValue('');
      this.datosForm.get('activo').setValue(true);
      this.datosForm.markAsPristine();
      this.criterios = [];
      this.criteria = [];
    }

  }

  enviar() {
    this.submited = true;
    this.datosForm.get('uid').setValue(this.uid);
    console.log(this.datosForm.get('uid').value);
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.rubricaService.crearRubrica( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['rubrica'].uid;
          this.datosForm.get('uid').setValue( res['rubrica'].uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nuevo Rubrica',
            text: 'El rubrica ' + res['rubrica'].nombre + ' ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });

          this.router.navigateByUrl('/admin/rubricas/');
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.rubricaService.actualizarRubrica( this.datosForm.get('uid').value, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Rúbrica modificada',
            text: 'La rubrica se ha modificado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.datosForm.get('uid').setValue('nuevo');
    this.datosForm.get('activo').setValue('true');
    this.submited = false;
    this.datosForm.markAsPristine();
  }

  cancelar() {
      this.router.navigateByUrl('/admin/rubricas');
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value === 'nuevo') { return true; }
    return false;
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursosService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  guardarLista(evento: string[]) {
    console.log('Guardamos lista rubricas',this.uid);
    this.rubricaService.actualizarLista(this.uid, evento)
      .subscribe( res => {
      },(err)=>{
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Ocurrió un error, inténtelo más tarde',});
        return;
      });
  }

}
