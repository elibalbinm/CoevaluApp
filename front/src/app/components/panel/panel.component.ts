import { Component, OnInit, Input } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { RubricaService } from 'src/app/services/rubrica.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CriterioService } from '../../services/criterio.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { EscalaService } from 'src/app/services/escala.service';
import { IteracionService } from 'src/app/services/iteracion.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';

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
              private escalaService: EscalaService,
              private evaluacionService: EvaluacionService,
              private iteracionService: IteracionService,
              private grupoService: GrupoService,
              private usuarioService: UsuarioService,
              private rubricaService: RubricaService,
              private criterioService: CriterioService) { }

  ngOnInit(): void {
    this.totalRegistros();
  }

  totalRegistros(){
    switch(this._coleccion) {
      case 'Asignaturas': {
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
      case 'Cursos': {
        this.asignaturaService.totalCursos().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log('aaaaaaaaaaaaaaaaaa',res['numOfDocs']);
        });
        break;
      }
      case 'Grupos': {
        this.grupoService.totalGrupos().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
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
      case 'Escalas': {
        this.escalaService.totalEscalas().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      case 'Iteraciones': {
        this.iteracionService.totalIteraciones().subscribe( res => {
          this._numeroTotal = res['numOfDocs'];
          console.log(res['numOfDocs']);
        });
        break;
      }
      case 'Evaluaciones': {
        this.evaluacionService.totalEvaluaciones().subscribe( res => {
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
