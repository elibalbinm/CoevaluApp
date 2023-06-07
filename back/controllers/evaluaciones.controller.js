const { response } = require("express");
const { infoToken } = require("../helpers/infotoken");
const Evaluacion = require("../models/evaluaciones.model");
const Iteracion = require("../models/iteraciones.model");
const Criterio = require("../models/criterios.model");
const Usuario = require("../models/usuarios.model");
const Escala = require("../models/escalas.model");

const evaluationCtrl = {};

evaluationCtrl.totalEvaluaciones = async(req, res) => {
    
    try {
        const total = await Evaluacion.estimatedDocumentCount((err, numOfDocs) => {
            if(err) throw(err);
    
            console.log(`Total evaluaciones: ${numOfDocs}.`);

            res.json({
                ok: true,
                msg: 'Número de evaluaciones registradas en la BBDD',
                numOfDocs
            });
        });
        
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al contabilizar el número de evaluaciones.',
            error
        });
    }

}

evaluationCtrl.getEvaluationsByStudent = async (req, res = response) => {
  console.log('Entra')
  // const id = req.params.id;
  const id = req.query.id || '';
  const iteracion = req.query.iteracion || '';
  console.log("ID: ", id);

  try {
    const token = req.header("x-token");
    console.log("Token: ", token);

    if (!(infoToken(token).rol === "ROL_ADMIN" ||
          infoToken(token).rol === "ROL_ALUMNO" ||
          infoToken(token).rol === "ROL_PROFESOR")) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene permisos para obtener datos de Evaluaciones",
      });
    }

    let evaluaciones, total, query = {};
    const existeAlumno = await Usuario.findById(id);

    if (id && existeAlumno !== '') {
      console.log('Entra x1')
      query = { $or: [{ alumno: id }] };

      if(iteracion !== ''){
        console.log('Entra')
        query = { alumno: id, iteracion: iteracion };
      }

      console.log(query);

      [evaluaciones, total] = await Promise.all([
        Evaluacion.find(query)
        .populate({
          path: "valores.votaciones",
          populate: { path: "alumno_votado", model: Usuario },
        })
        .populate({
          path: "valores.votaciones",
          populate: { path: "escala", model: Escala },
        })
        .populate({ path: "valores.criterio", model: Criterio })
        .populate("alumno")
        .populate("iteracion")
        .populate("criterio"),
        Evaluacion.countDocuments(),
      ]);

      // if(!evaluaciones.length){
      //   [evaluaciones, total] = await Promise.all([
      //     Evaluacion.find({ $or: [{ alumno: id }] })
      //     .populate({
      //       path: "valores.votaciones",
      //       populate: { path: "alumno_votado", model: Usuario },
      //     })
      //     .populate({
      //       path: "valores.votaciones",
      //       populate: { path: "escala", model: Escala },
      //     })
      //     .populate({ path: "valores.criterio", model: Criterio })
      //     .populate("alumno")
      //     .populate("iteracion")
      //     .populate("criterio"),
      //     Evaluacion.countDocuments(),
      //   ]);
      // }
    }

    res.status(200).json({
      ok: true,
      msg: "Request getEvaluationsByStudent successful",
      evaluaciones,
    });
  } catch (error) {
    // res.status(404).json({message: err.message});
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "Error al obtener evaluaciones por id del alumno.",
    });
  }
}

evaluationCtrl.getEvaluations = async (req, res = repsonse) => {
  // Paginación
  const desde = Number(req.query.desde) || 0;
  const hasta = req.query.hasta || "";
  let registropp = Number(process.env.DOCSPERPAGE);
  const id = req.query.id;
  const texto = req.query.texto;
  let textoBusqueda = "";

  console.log("Texto: " + texto);

  if (texto) {
    textoBusqueda = new RegExp(texto, "i");
    //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
  }
  if (hasta === "todos") {
    registropp = 1000;
  }
  //await sleep(2000);
  try {
    let evaluaciones, total;
    if (id) {
      [evaluaciones, total] = await Promise.all([
        Evaluacion.findById(id)
          .populate({ path: "alumno", model: Usuario })
          .populate("iteracion")
          .populate("criterio")
          .populate({
            path: "valores",
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: "criterio", model: Criterio },
          })
          .populate({
            path: "valores.votaciones",
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: "alumno_votado", model: Usuario },
          })
          .populate({
            path: "valores.votaciones",
            populate: { path: "escala", model: Escala },
          }),
        Evaluacion.countDocuments(),
      ]);
    } else {
      if (texto) {
        [evaluaciones, total] = await Promise.all([
          Evaluacion.find({
            $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }],
          })
            .skip(desde)
            .limit(registropp),
          Evaluacion.countDocuments({
            $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }],
          }),
        ]);
      } else {
        [evaluaciones, total] = await Promise.all([
          Evaluacion.find({})
            .skip(desde)
            .limit(registropp)
            .populate({
              path: "valores.votaciones",
              populate: { path: "alumno_votado", model: Usuario },
            })
            .populate({
              path: "valores.votaciones",
              populate: { path: "escala", model: Escala },
            })
            .populate({ path: "valores.criterio", model: Criterio })
            .populate("alumno")
            .populate("iteracion")
            .populate("criterio"),
          Evaluacion.countDocuments(),
        ]);
      }
    }
    res.json({
      ok: true,
      msg: "Request getEvaluacion successful",
      evaluaciones,
      page: {
        desde,
        registropp,
        total,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error al obtener evaluaciones",
    });
  }
};

//POST
evaluationCtrl.createEvaluation = async (req, res = response) => {
  console.log("Entra a createEvaluation");

  if (!req.body) return res.sendStatus(400);
  console.log(req.body);

  const { alumno, iteracion, valores } = req.body;
  // console.log("Alumno: "+alumno)
  // console.log("Iteracion: "+iteracion)
  // console.log("Votaciones: ",votaciones)
  // const valores = votaciones[0].valores;
  // console.log("Valores: ",valores)
  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para crear evaluaciones",
    });
  }

  try {
    //Comprobar que existe el criterio
    // const existeCriterio = await Criterio.find().where("_id").in(criterio);
    // if (!existeCriterio) {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "El criterio asignado a la evaluación no existe",
    //   });
    // }

    //Comprobar que existe el usuario
    const existeAlumno = await Usuario.find().where("_id").in(alumno);
    if (!existeAlumno) {
      return res.status(400).json({
        ok: false,
        msg: "El alumno asignado a la evaluación no existe",
      });
    }

    // Comrprobar que existe la iteracion
    const existeIteracion = await Iteracion.findById(iteracion);
    if (!existeIteracion) {
      return res.status(400).json({
        ok: false,
        msg: "La iteración asignada a la evaluación no existe",
      });
    }

    //Comprobación del array de votaciones
    let listavotacionesusu = [];
    if (valores) {
      console.log("Valores: " + valores);
      
      // Convertimos el array de objetos en un array con los strings de id de usuario
      // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
      const listausu = valores.map(async (registro) => {
        console.log("Registro: " + registro);
        if (registro.criterio) {
          console.log("Registro.criterio: " + registro.criterio);
          
          const existeCriterio = await Criterio.findById(
            registro.criterio
          );

          if (!existeCriterio) {
            return res.status(400).json({
              ok: false,
              msg: "El criterio asignado a la evaluación no existe en la BBDD",
            });
          }

          console.log("Votaciones: " + registro.votaciones);
          const listaValores = registro.votaciones;
          const resultado = listaValores.map(async (registro2) => {
            if (registro2.alumno_votado) {
              console.log("Alumno a votar: " + registro2.alumno_votado);
              // listavotacionesusu.concat(registro2.criterio);
              // console.log('Despues: Listavotacionesusu: '+JSON.stringify(listavotacionesusu));
              const existeAlumnoRubrica = await Usuario.find()
                .where("_id")
                .in(registro2.alumno_votado);
              if (!existeAlumnoRubrica) {
                return res.status(400).json({
                  ok: false,
                  msg: "El alumnado asignado a la evaluación no existe en la BBDD",
                });
              }

              if (existeAlumno === existeAlumnoRubrica) {
                return res.status(400).json({
                  ok: false,
                  msg: "El alumno asignado en la votación no puede votarse a sí mismo",
                });
              }
            }

            if (registro2.escala) {
              console.log("Escala: " + registro2.escala);
              const existeEscala = await Escala.findById(registro2.escala);
              if (!existeEscala) {
                return res.status(400).json({
                  ok: false,
                  msg: "La escala asignada a la evaluación no existe en la BBDD",
                });
              }
            }
          });

          // console.log('Antes: listavotacionesusu: '+JSON.stringify(listavotacionesusu));
          // console.log('Done')
         
          

          //Esto dejarlo a lo ultimo, primero hacer las comprobaciones de criterio y escala
          listavotacionesusu.push(registro);
          console.log("Registroooooooo " + registro);
          console.log(
            "Listavotacionesusu: " + JSON.stringify(listavotacionesusu)
          );
        }
      });
    }

    const evaluacion = new Evaluacion(req.body);
    // evaluacion.votaciones = listavotacionesusu;

    console.log("Evaluación votaciones: " + evaluacion.votaciones);

    await evaluacion.save();

    res.json({
      ok: true,
      msg: "Evaluación creada con éxito",
      evaluacion,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error creando evaluación",
    });
  }
};

evaluationCtrl.updateEvaluation = async (req, res) => {
  
  const { alumno, iteracion, votaciones } = req.body;
  const uid = req.params.id;

  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para actualizar evaluaciones",
    });
  }

  try {
    const existeEvaluacion = await Evaluacion.findById(uid);
    if (!existeEvaluacion) {
      return res.status(400).json({
        ok: false,
        msg: "La evaluación no existe",
      });
    }

    //Comprobar que existe el usuario
    const existeAlumno = await Usuario.find().where("_id").in(alumno);
    if (!existeAlumno) {
      return res.status(400).json({
        ok: false,
        msg: "El alumno asignado a la evaluación no existe",
      });
    }

    // Comrprobar que existe la iteracion
    const existeIteracion = await Iteracion.findById(iteracion);
    if (!existeIteracion) {
      return res.status(400).json({
        ok: false,
        msg: "La iteración asignada a la evaluación no existe",
      });
    }

    const evaluacion = await Evaluacion.findByIdAndUpdate(uid, object, {
      new: true,
    });
    res.json({
      ok: true,
      msg: "Evaluacion actualizado",
      evaluacion,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "Error actualizando evaluación.",
    });
  }
};

evaluationCtrl.updateList = async (req, res) => {
  const { alumno, iteracion, valores } = req.body;
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>', req.body);
  const id = req.params.id;
  console.log("ID Evaluaciones: ", id);
  const lista = await req.body;
  console.log("Lista: ", lista);

  if (!req.body) return res.sendStatus(400);

  // TO-DO: recorrer el array de req.body con un map o algo e ir almacenando los valores
  // de cda uno de ellos o ver como hacer para que se pueda almacenar req.body
  // y se lea en formato JSON sin que salga undefined
  // console.log('Votaciones: ', lista);

  // const entries = Object.entries(lista);
  // const data = lista.map( ([key, val] = entry) => {
  //     return `The ＄{key} is ＄{val}`;
  // });

  // data;

  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.json({
      ok: false,
      msg: "No tiene permisos para modificar lista de valores de la coevaluación",
    });
  }

  // Antes de insertar, limpiamos la lista de posibles duplicados o no existentes
  let listaInsertar = [];
  try {
    console.log("Entramos dentro");

    const evaluacion = await Evaluacion.findById(id);
    const listadoAlumnos = [];
    console.log("Evaluacion: ", evaluacion.valores);

    // Recorremos array de Lista para comprobar que los criterios, escalas y alumnos existen
    const votaciones = lista.map(async (_) => {
      console.log('Entra al mapeado de Lista')
      if(_.criterio) {
        const existeCriterio = await Criterio.findById(_.criterio);

        if (!existeCriterio) {
          return res.status(400).json({
            ok: false,
            msg: "El criterio asignado a la evaluación no existe en la BBDD.",
          });
        }
      }
      // console.log('Listado de votacionesssssssssssssssssssss ', _.votaciones);
      _.votaciones.forEach(async x => {
        if(x.alumno_votado) {
          console.log(x.idAlumno);
          const existeAlumno = await Usuario.find().where("_id").in(x.alumno_votado);
          console.log(existeAlumno);

          if(!existeAlumno) {
            return res.status(400).json({
              ok: false,
              msg: "El alumnado asignado a la evaluación no existe en la BBDD",
            });
          }
        }

        if(x.escala) {
          const existeEscala = await Escala.findById(x.escala);
          if (!existeEscala) {
            return res.status(400).json({
              ok: false,
              msg: "La escala asignada a la evaluación no existe en la BBDD",
            });
          }
        }
      });
    });
    
    // Recorremos array de Valores del modelo de Evaluación
    // const valores = evaluacion.valores.map(async (_) => {
      

    //   const listadoVotaciones = _.votaciones;
    //   const votaciones = listadoVotaciones.map(async (value) => {
    //     if(value.idAlumno !== null || value.idAlumno !== 'undefined'){
    //       const existeAlumnoRubrica = await Usuario.find().where("_id").in(value.idAlumno);
    //     }
    //   })
    // })

    console.log("Evaluacion con nuevo elemento: ", evaluacion);

    // const resultado = await Evaluacion.findByIdAndUpdate(id, evaluacion, {
    //   new: true,
    // });

    const resultado = await Evaluacion.findByIdAndUpdate(id, {"valores": lista}, function(err,result) {
      if(err){
        res.send(err)
      }
      else{
          // res.send(result)
          res.json({
            ok: true,
            msg: `Evaluación - Actualizar lista de aluumno`,
            result,
          });
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({
      ok: false,
      msg: `Error al actualizar listas de alumnos de evaluación`,
    });
  }
};

evaluationCtrl.deleteEvaluation = async (req, res = response) => {
  const uid = req.params.id;

  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para eliminar evaluaciones",
    });
  }

  try {
    // Comprobamos si existe el Evaluacion que queremos borrar
    const existeEvaluacion = await Evaluacion.findById(uid);
    if (!existeEvaluacion) {
      return res.status(400).json({
        ok: true,
        msg: "La evaluación no existe",
      });
    }
    // Lo eliminamos y devolvemos el usuaurio recien eliminado
    const resultado = await Evaluacion.findByIdAndRemove(uid);

    res.json({
      ok: true,
      msg: "Evaluación eliminada",
      resultado: resultado,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error borrando evaluación",
    });
  }
};

module.exports = { evaluationCtrl };
