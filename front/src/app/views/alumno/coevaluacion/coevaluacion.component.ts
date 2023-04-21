import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Evaluacion } from "src/app/models/evaluacion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { GrupoService } from "src/app/services/grupo.service";
import Swal from "sweetalert2";
import { EvaluacionService } from "../../../services/evaluacion.service";
import { Escala } from "src/app/models/escala.model";

@Component({
  selector: "app-coevaluacion",
  templateUrl: "./coevaluacion.component.html",
})
export class CoevaluacionComponent implements OnInit {
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

  info = {
    alumnosGrupo: [
      { idalumno: "1a", nombre: "Pepito" },
      { idalumno: "2a", nombre: "Maria" },
      { idalumno: "3a", nombre: "Juan" },
      { idalumno: "4a", nombre: "Pepito" },
      { idalumno: "5a", nombre: "Maria" },
      // {idalumno:'6a', nombre: 'Juan'},
    ],
    listaDimensiones: [
      { idDimension: "1d", nombre: "Roles y liderazto" },
      { idDimension: "2d", nombre: "Tiempo" },
      { idDimension: "3d", nombre: "Eficiencia" },
      { idDimension: "4d", nombre: "Tontuna" },
    ],
    listaEscalas: [
      [
        { idEscala: "11e", idDimension: "1d", descripcion: "Lo hace genial" },
        { idEscala: "12e", idDimension: "1d", descripcion: "Mas o menos" },
        { idEscala: "13e", idDimension: "1d", descripcion: "Fatal" },
        {
          idEscala: "14e",
          idDimension: "1d",
          descripcion: "Medio se puede esperar algo",
        },
      ],
      [
        { idEscala: "21e", idDimension: "2d", descripcion: "Lo hace genial" },
        { idEscala: "22e", idDimension: "2d", descripcion: "Mas o menos" },
        { idEscala: "23e", idDimension: "2d", descripcion: "Fatal" },
        {
          idEscala: "24e",
          idDimension: "2d",
          descripcion: "Medio se puede esperar algo",
        },
      ],
      [
        { idEscala: "31e", idDimension: "3d", descripcion: "Lo hace genial" },
        { idEscala: "32e", idDimension: "3d", descripcion: "Mas o menos" },
        { idEscala: "33e", idDimension: "3d", descripcion: "Fatal" },
      ],
      [
        { idEscala: "41e", idDimension: "4d", descripcion: "Lo hace genial" },
        { idEscala: "42e", idDimension: "4d", descripcion: "Mas o menos" },
        { idEscala: "43e", idDimension: "4d", descripcion: "Fatal" },
        {
          idEscala: "44e",
          idDimension: "4d",
          descripcion: "Medio se puede esperar algo",
        },
      ],
    ],
  };

  // const someNumbers = [...new Array(3)].map((_,i) => i * 10);
  // console.log(someNumbers); // [0,10,20];

  guardar = [
    {
      dimension: "1d",
      votaciones: [
        { idAlumno: "1a", idEscala: "12e" },
        { idAlumno: "2a", idEscala: "11e" },
        { idAlumno: "3a", idEscala: "13e" },
        { idAlumno: "4a", idEscala: "12e" },
        { idAlumno: "5a", idEscala: "12e" },
        // {idAlumno: '6a', idEscala:'13e'},
      ],
    },
    {
      dimension: "2d",
      votaciones: [
        { idAlumno: "1a", idEscala: "22e" },
        { idAlumno: "2a", idEscala: "21e" },
        { idAlumno: "3a", idEscala: "23e" },
        { idAlumno: "4a", idEscala: "22e" },
        { idAlumno: "5a", idEscala: "22e" },
        // {idAlumno: '6a', idEscala:'23e'},
      ],
    },
    {
      dimension: "3d",
      votaciones: [
        { idAlumno: "1a", idEscala: "32e" },
        { idAlumno: "2a", idEscala: "31e" },
        { idAlumno: "3a", idEscala: "33e" },
        { idAlumno: "4a", idEscala: "32e" },
        { idAlumno: "5a", idEscala: "32e" },
        // {idAlumno: '6a', idEscala:'33e'},
      ],
    },
    {
      dimension: "4d",
      votaciones: [
        { idAlumno: "1a", idEscala: "42e" },
        { idAlumno: "2a", idEscala: "41e" },
        { idAlumno: "3a", idEscala: "43e" },
        { idAlumno: "4a", idEscala: "42e" },
        { idAlumno: "5a", idEscala: "42e" },
        // {idAlumno: '6a', idEscala:'43e'},
      ],
    },
  ];

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
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private criterioService: CriterioService,
    private router: Router
  ) {}

  ngOnInit(): void {this.uid = this.route.snapshot.params["uid"];
    this.cargarDatos();
  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== "nuevo") {
      this.evaluacionService.cargarEvaluacion(this.uid).subscribe(
        (res) => {
          console.log(res);
          if (!res["evaluaciones"]) {
            this.router.navigateByUrl("/admin/iteraciones");
            return;
          }

          this.evaluaciones = res["evaluaciones"].valores;
          console.log('Evaluaciones (valores): ',this.evaluaciones)

          this.arrayCriterios = res["evaluaciones"].valores.map(_ => ({
            id: `${_.criterio._id}`
          }));

          res["evaluaciones"].valores.map((item, index) => {
            this.arrayAlumnos = [];
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>> ',item.votaciones.alumno_votado),
            item.votaciones.map(_ => {

              console.log('+`+++++++++++++++++++++',_.alumno_votado)

               const x = {
                id: _.alumno_votado._id,
                nombre: _.alumno_votado.nombre + ' ' + _.alumno_votado.apellidos
              };

              this.arrayAlumnos.push(x);
            })
          });
          console.log('++++++++++++++++++++++++++++++', this.arrayAlumnos);
          console.log('Array criteriosssssssss ',this.arrayCriterios)

          this.cargarEscalas();
          this.inicializarArrays();
          console.log("Iniciando guardar:", this.guardarVacio);
          this.submited = true;
        },
        (err) => {
          this.router.navigateByUrl("/admin/evaluaciones");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo completar la acción, vuelva a intentarlo",
          });
          return;
        }
      );
    } else {

    }
  }

  inicializarArrays() {
    this.arrayVotaciones = [...new Array(this.arrayAlumnos.length)].map(
      (_, i) => {
        const obj = {
          alumno_votado: this.arrayAlumnos[i].id,
          escala: "",
          valor: "-1",
        };
        return obj;
      }
    );

    this.guardarVacio = [...new Array(this.arrayCriterios.length)].map(
      (_, i) => {
        return {
          criterio: this.arrayCriterios[i].id,
          votaciones: JSON.parse(JSON.stringify(this.arrayVotaciones)),
        };
      }
    );
  }

  objectKeys(objeto: any) {
    this.keys = Object.keys(objeto);
    console.log(this.keys); // echa un vistazo por consola para que veas lo que hace "Object.keys"
  }

  seleccionar(
    dimension: any,
    posDimension: number,
    alumno: any,
    posAlumno: number,
    escala: any
  ) {
    this.guardarVacio[posDimension].votaciones[posAlumno].escala =
      escala.target.value;
    console.log(
      "Alumno:",
      alumno,
      "dimension:",
      dimension,
      " Escala:",
      escala.target.value
    );
    console.log("GuardarVacio:", this.guardarVacio);
  }

  enviarDatos() {
    console.log("Entro a enviarDatos");
    let completo = true;

    this.guardarVacio.forEach((element) => {
      element.votaciones.forEach((votacion: any) => {
        console.log("guardarVacio: ", this.guardarVacio);
        if (votacion.escala === "") {
          completo = false;
        }
      });
    });

    // if (!completo) console.log("No puedes enviar, faltan datos");
    // else {
      this.evaluacionService
        .actualizarVotacion(this.uid, this.guardarVacio)
        .subscribe(
          (res) => {
            console.log("Se ha suscrito correctamente: ", res);
          },
          (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrió un error, inténtelo más tarde",
            });
            return;
          }
        );
    // }
  }

  // Evento de Grupo Component
  guardarLista(evento: string[]) {
    console.log("Evento de guardarLista: ", evento);
  }

  // Funcion que a partir de un criterio dado, busca en la BBDD todos los posibles niveles que dispone
  // y los almacena en un array
  cargarEscalas() {
    console.log('cargarEscalas');
    console.log(this.arrayCriterios);
    this.escalasPorCriterio = [];

    this.arrayCriterios.map(element => {
      console.log('Element: ', element);

      this.criterioService.cargarEscalasPorCriterio(element.id)
        .subscribe( res => {
          console.log('Res (escalas): ', res, ' Element: ',element);

          const temp = {
            id: element.id,
            escalas: res["escalas"]
          };
          console.log('Objeto creado temp:',temp);
          this.escalasPorCriterio.push(temp);

          /*
          let temp = [...new Array(this.arrayCriterios.length)]
          .map((_, i) => {
            return {
              id: element.id,
              escalas: res['escalas'],
            };
          })*/


          /*this.escalasPorCriterio = [...new Array(this.arrayCriterios.length)]
          .map((_, i) => {
            return {
              id: element.id,
              escalas: res['escalas'],
            };
          })*/

          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>', this.escalasPorCriterio);
      },(err)=>{
        console.log('Error: ',err);
      });
    });
  }
}
