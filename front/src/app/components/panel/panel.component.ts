import { Component, OnInit, Input } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { RubricaService } from 'src/app/services/rubrica.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CriterioService } from '../../services/criterio.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit {

  @Input()
  get numeroTotal(): string {
    return this._numeroTotal;
  }
  set numeroTotal(numeroTotal: string) {
    this._numeroTotal = numeroTotal === undefined ? "0" : numeroTotal;
  }
  private _numeroTotal = "0";


  @Input()
  get coleccion(): string {
    return this._coleccion;
  }
  set coleccion(coleccion: string) {
    this._coleccion = coleccion === undefined ? "Colección" : coleccion;
  }
  private _coleccion = "Colección";

  constructor(private asignaturaService: AsignaturaService,
              private usuarioService: UsuarioService,
              private rubricaService: RubricaService,
              private criterioService: CriterioService) { }

  ngOnInit(): void {
    this.totalRegistros();
  }

  totalRegistros(){
    switch(this._coleccion) {
      case 'Asignaturas': {
        // this._numeroTotal = this.asignaturaService.totalAsignaturas();
        // console.log('Numero total: '+this._numeroTotal)

        this.asignaturaService.totalAsignaturas().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      case 'Criterios': {
        this.criterioService.totalCriterios().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      case 'Grupos': {

        break;
      }
      case 'Rúbricas': {
        this.rubricaService.totalRubricas().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      case 'Usuarios': {
        this.usuarioService.totalRegistros().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      default: {
         //statements;
         break;
      }
   }
  }
}
