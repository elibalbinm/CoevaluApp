import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Evaluacion } from "src/app/models/evaluacion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { EvaluacionService } from "../../../services/evaluacion.service";
import { Escala } from "src/app/models/escala.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-coevaluacion",
  templateUrl: "./coevaluacion.component.html",
})
export class CoevaluacionComponent implements OnInit {
  public nombre = false;
  public uid: string = "nuevo";
  public valores;
  public keys;
  public alumnos;
  public evaluaciones: Evaluacion[] = [];
  public escalas: Escala[] = [];
  public datosForm = this.fb.group({
    uid: [{ value: "nuevo", disabled: true }, Validators.required],
    hito: ["", Validators.required],
    iteracion: ["", Validators.required],
    curso: ["", Validators.required],
    fecha_ini: ["", Validators.required],
    fecha_fin: ["", Validators.required],
    fecha_ini_coe: ["", Validators.required],
    fecha_fin_coe: ["", Validators.required],
  });

  escalaId: any;
  submited: boolean = false;
  arrayCriterios: any;
  arrayCriteriosPorEscala: any;
  arrayAlumnos: any;
  escalasPorCriterio: any;
  arrayVotaciones: { alumno_votado: string; escala: string; valor: string; }[];
  guardarVacio: { criterio: string; votaciones: any; }[];
  // escalas: any;

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private route: ActivatedRoute,
    private criterioService: CriterioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.params["uid"];
    this.cargarDatos();
    if(this.uid === 'nuevo')
      this.nombre = true;
  }

  nuevo() {
    this.uid = 'nuevo';
    this.submited = false;
  }

  cargarDatos() {
  }

}
