import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UserSelect } from 'src/app/interfaces/user-select.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RubricaService } from 'src/app/services/rubrica.service';
import Swal from 'sweetalert2';
interface criteriaSelect{
  nombre: string;
  uid: string;
}

@Component({
  selector: 'app-card-users',
  templateUrl: './card-users.component.html'
})
export class CardUsersComponent implements OnInit {
  [x: string]: any;

  // Recibe una lista de usuarios extraidos de alumnos/profesores de BD
  // tiene la estructura {_id: string, usuario: string}
  @Input() criterios: {_id: string, criterio: string}[] = [];
  @Input() selected: {_id: string, usuario: string}[] = [];
  @Input() rol: string = 'ROL_ALUMNO';

  // Emite la lista de string de los usuarios seleccionados
  @Output() nuevaLista:EventEmitter<string[]> = new EventEmitter();

  public listaCriterios: criteriaSelect[] = [];
  public listaSelected: criteriaSelect[] = [];
  public listaUsers: criteriaSelect[] = [];

  constructor( private usuarioService: UsuarioService,
               private rubricaService: RubricaService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void{
    console.log('Entra a onChanges')

    if(this.selected.length < 0){
      this.cargarCriteriosSeleccionables;
    }
    this.cargarCriteriosSeleccionados();
    this.cargarCriteriosSeleccionables();
    // this.cargarUsuariosSeleccionables();
  }

  ordenarLista(lista: UserSelect[]) {
    return lista.sort( (a, b): number => {
              const nombrea = a.nombre.toLowerCase();
              const nombreb = b.nombre.toLowerCase();
              if (nombrea > nombreb) { return 1; }
              if (nombrea < nombreb) { return -1; }
              return 0;
            });
  }

  listaUID(listaU: UserSelect[]): string[] {
    let lista: string[] = [];
    for (let index = 0; index < listaU.length; index++) {
      lista[index] = listaU[index].uid;
    }
    return lista;
  }

  evento() {
    this.nuevaLista.emit(this.listaUID(this.listaSelected));
  }

  agregarTodos() {
    while (this.listaUsers.length>0) {
      this.agregar(0, false);
    }
    this.listaUsers = this.ordenarLista(this.listaUsers);
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
    if (pos < 0 || pos > this.listaUsers.length) { return; }
    // Añadimos el elemento a seleccionado
    this.listaSelected.push(this.listaUsers[pos]);
    this.criterios.push({_id:'', criterio:this.listaUsers[pos].uid});
    // Eliminamos el elemento de users
    this.listaUsers.splice(pos, 1);
    this.listaSelected = this.ordenarLista(this.listaSelected);
    if (evento) {
      this.evento();
    }
  }

  quitar(pos: number, evento?: boolean): void {
    if (pos < 0 || pos > this.listaSelected.length) { return; }
    // Añadimos el elemento a usuarios
    this.listaUsers.push(this.listaSelected[pos]);

    // Eliminamos el elemento de users
    this.listaSelected.splice(pos, 1);
    // La lista que queda la volcamos en selected
    let local: {_id: string, criterio: string}[] = [];
    this.listaSelected.forEach(user => {
      local.push({_id:'', criterio: user.uid});
    });
    this.criterios = local;
    this.listaUsers = this.ordenarLista(this.listaUsers);
    if (evento) {
      this.evento();
    }
  }

  cargarCriteriosSeleccionados(): void {
    if (this.criterios === undefined) {
      this.listaSelected = [];
      return;
    }
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    this.criterios.forEach(user => {
      selectedarray.push(user.criterio);
    });

    this.rubricaService.cargarListaCriterios( selectedarray )
      .subscribe( res => {
        this.listaSelected=[];
        res['criterios'].map( usuario => {
          this.listaSelected.push({nombre: `${usuario.nombre}` , uid: `${usuario.uid}`});
        });
      }, (err) => {
      });
  }

  cargarCriteriosSeleccionables(): void {
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    if (this.criterios !== undefined) {

      this.criterios.forEach(user => {
        selectedarray.push(user.criterio);
      });
    }
    this.rubricaService.cargarCriterios( selectedarray )
      .subscribe( res => {
        this.listaUsers = [];
        console.log("cargarCriteriosSeleccionables"+res['criterios'])
        res['criterios'].map( usuario => {
          this.listaUsers.push({nombre: `${usuario.nombre}` , uid: `${usuario.uid}`});
        });
      }, (err) => {
      });
  }

  cargarUsuariosSeleccionables(): void {
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    if (this.selected !== undefined) {

      this.selected.forEach(user => {
        selectedarray.push(user.usuario);
      });
    }

    this.usuarioService.cargarUsuariosRol( this.rol, selectedarray )
      .subscribe( res => {
        this.listaUsers = [];
        res['usuarios'].map( usuario => {
          this.listaUsers.push({nombre: `${usuario.apellidos}, ${usuario.nombre}` , uid: `${usuario.uid}`});
        });
      }, (err) => {
      });
  }
}
