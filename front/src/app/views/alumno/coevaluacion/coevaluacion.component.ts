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

  arrayVotaciones = [...new Array(this.info.alumnosGrupo.length)].map(
    (_, i) => {
      const obj = {
        idAlumno: this.info.alumnosGrupo[i].idalumno,
        idEscala: "",
        valor: "-1",
      };
      return obj;
    }
  );

  guardarVacio = [...new Array(this.info.listaDimensiones.length)].map(
    (_, i) => {
      return {
        dimension: this.info.listaDimensiones[i].idDimension,
        votaciones: JSON.parse(JSON.stringify(this.arrayVotaciones)),
      };
    }
  );

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

  submited: boolean = false;
  arrayCriterios: any;
  arrayCriteriosPorEscala: any;
  escalasPorCriterio: any;
  // escalas: any;

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private criterioService: CriterioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Iniciando guardar:", this.guardarVacio);
    this.uid = this.route.snapshot.params["uid"];
    this.cargarDatos();
  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== "nuevo") {
      this.evaluacionService.cargarEvaluacion(this.uid).subscribe(
        (res) => {
          if (!res["evaluaciones"]) {
            this.router.navigateByUrl("/admin/iteraciones");
            return;
          }
          console.log('Valor resultado:', res);
          console.log('Valor obtenidos:',res["evaluaciones"].valores);
          this.evaluaciones = res["evaluaciones"].valores;
          console.log('Valor Evaluaciones:',this.evaluaciones);
          this.valores = this.evaluaciones.map((valor) => ({
            ...valor ?? [],
          }));

          console.log("Valor Valores: ", this.valores);
          this.arrayCriterios = this.valores.map(_ => ({
            id: `${_.criterio._id}`
          }));

          console.log('Array criteriosssssssss ',this.arrayCriterios)
          // this.datosForm.get('iteracion').setValue(res['iteraciones'].iteracion);
          // this.datosForm.get('hito').setValue(res['iteraciones'].hito);
          // this.datosForm.get('curso').setValue(res['iteraciones'].curso._id);
          // this.datosForm.get('fecha_ini').setValue(moment(res['iteraciones'].fecha_ini).format('YYYY-MM-DD'));
          // this.datosForm.get('fecha_fin').setValue(moment(res['iteraciones'].fecha_fin).format('YYYY-MM-DD'));
          // this.datosForm.get('fecha_ini_coe').setValue(moment(res['iteraciones'].fecha_ini_coe).format('YYYY-MM-DD'));
          // this.datosForm.get('fecha_fin_coe').setValue(moment(res['iteraciones'].fecha_fin_coe).format('YYYY-MM-DD'));
          // this.datosForm.markAsPristine();
          // this.uid = res['iteraciones'].uid;
          this.cargarEscalas();
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
      // this.datosForm.get('iteracion').setValue('');
      // this.datosForm.get('hito').setValue('');
      // this.datosForm.get('curso').setValue('');
      // this.datosForm.get('fecha_ini').setValue('');
      // this.datosForm.get('fecha_fin').setValue('');
      // this.datosForm.get('fecha_ini_coe').setValue('');
      // this.datosForm.get('fecha_fin_coe').setValue('');
      // this.datosForm.markAsPristine();
    }
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
    this.guardarVacio[posDimension].votaciones[posAlumno].idEscala =
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

  // seleccionar(
  //   dimension: any,
  //   posDimension: number,
  //   alumno: any,
  //   posAlumno: number,
  //   escala: any
  // ) {
  //   this.guardarVacio[posDimension].votaciones[posAlumno].idEscala =
  //     escala.target.value;
  //   console.log(
  //     "Alumno:",
  //     alumno,
  //     "dimension:",
  //     dimension,
  //     " Escala:",
  //     escala.target.value
  //   );
  //   console.log("GuardarVacio:", this.guardarVacio);
  // }

  enviarDatos() {
    console.log("Entro a enviarDatos");
    let completo = true;

    this.guardarVacio.forEach((element) => {
      element.votaciones.forEach((votacion: any) => {
        console.log("guardarVacio: ", this.guardarVacio);
        if (votacion.idEscala === "") {
          completo = false;
        }
      });
    });

    if (!completo) console.log("No puedes enviar, faltan datos");
    else {
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
    }
  }

  // Evento de Grupo Component
  guardarLista(evento: string[]) {
    console.log("Evento de guardarLista: ", evento);
    // this.grupoService.actualizarLista(this.uid, evento)
    //   .subscribe( res => {
    //   },(err)=>{
    //     Swal.fire({icon: 'error', title: 'Oops...', text: 'Ocurrió un error, inténtelo más tarde',});
    //     return;
    //   });
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
              id:element.id,
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

            console.log('>>>>>>>>>>>>>>>>>>>>>>>>', this.escalasPorCriterio);
        },(err)=>{
          console.log('Error: ',err);
        });
      });
    // this.criterioService.cargarEscalasPorCriterio(id)
    //   .subscribe( res => {
    //     console.log('Res (escalas): ', res);
    //     this.escalas = res['escalas'];
    // },(err)=>{
    //   console.log('Error: ',err);
    // });
  }
}
