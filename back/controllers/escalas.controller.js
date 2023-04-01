const { response } = require("express");

const Escala = require("../models/escalas.model");
const Curso = require("../models/cursos.model");
const Criterio = require("../models/criterios.model");
const scaleCtrl = {};

const { infoToken } = require("../helpers/infotoken");

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

scaleCtrl.getScales = async (req, res = repsonse) => {
  // Paginación
  const desde = Number(req.query.desde) || 0;
  const hasta = req.query.hasta || "";
  let registropp = Number(process.env.DOCSPERPAGE);
  const id = req.query.id;
  const texto = req.query.texto;
  let textoBusqueda = "";
  if (texto) {
    textoBusqueda = new RegExp(texto, "i");
    //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
  }
  if (hasta === "todos") {
    registropp = 1000;
  }
  //await sleep(2000);
  try {
    let escalas, total;
    if (id) {
      [escalas, total] = await Promise.all([
        // Escala.findById(id),
        Escala.findById(id).populate({
          path: "criterio",
          populate: { path: "criterio.nombre" },
        }),
        Escala.countDocuments(),
      ]);
    } else {
      if (texto) {
        [escalas, total] = await Promise.all([
          Escala.find({
            $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }],
          })
            .skip(desde)
            .limit(registropp),
          Escala.countDocuments({
            $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }],
          }),
        ]);
      } else {
        [escalas, total] = await Promise.all([
          Escala.find({}).skip(desde).limit(registropp).populate("criterio"),
          Escala.countDocuments(),
        ]);
      }
    }
    res.json({
      ok: true,
      msg: "Request getScales successful",
      escalas,
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
      msg: "Error al obtener escalas",
    });
  }
};

scaleCtrl.getScalesByCriteria = async (req, res = repsonse) => {
  console.log("Entra a getScalesByCriteria");
  // console.log(req);
  const id = req.params.id;
  console.log("ID: ", id);

  try {
    const token = req.header("x-token");
    console.log("Token: ", token);
    if (!(infoToken(token).rol === "ROL_ADMIN")) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene permisos para actualizar cursos",
      });
    }

    let escalas, total;
    const existeCriterio = await Criterio.findById(id);
    if (id && existeCriterio) {
      [escalas, total] = await Promise.all([
        Escala.find({ $or: [{ criterio: id }] }).populate("criterio"),
        Escala.countDocuments(),
      ]);
    }

    res.status(200).json({
      ok: true,
      msg: "Request getScalesByCriteria successful",
      escalas,
    });
  } catch (error) {
    // res.status(404).json({message: err.message});
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "Error al obtener escalas",
    });
  }
};

scaleCtrl.createScale = async (req, res = response) => {
  const { criterio, ...object } = req.body;
  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para crear escalas",
    });
  }

  try {
    // Comrprobar que existe el criterio que queremos asociar a la escala
    const existeCriterio = await Criterio.findById(criterio);
    if (!existeCriterio) {
      return res.status(400).json({
        ok: false,
        msg: "El criterio asignado en la escala no existe",
      });
    }

    object.criterio = criterio;

    const escala = new Escala(object);

    // Almacenar en BD
    await escala.save();

    res.json({
      ok: true,
      msg: "Escala creada correctamente",
      escala,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error creando escala",
    });
  }
};

scaleCtrl.updateScale = async (req, res) => {
  const object = req.body;
  const uid = req.params.id;
  const criterio = req.body.criterio;

  try {
    // Comprobar que el criterio que se va a asignar a la escala existe
    const existeCriterio = await Criterio.findById(criterio);
    if (!existeCriterio) {
      return res.status(400).json({
        ok: false,
        msg: "El criterio asignado a la escala no existe",
      });
    }

    const existeEscala = await Escala.findById(uid);
    if (!existeEscala) {
      return res.status(400).json({
        ok: false,
        msg: "La escala no existe en la BD",
      });
    }

    const item = await Escala.findByIdAndUpdate(uid, object, { new: true });
    res.json({
      ok: true,
      msg: "Escala actualizada",
      item,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error actualizando la escala",
    });
  }
};

scaleCtrl.deleteScale = async (req, res = response) => {
  const uid = req.params.id;

  // Solo puede crear usuarios un admin
  const token = req.header("x-token");
  // lo puede actualizar un administrador o el propio usuario del token
  if (!(infoToken(token).rol === "ROL_ADMIN")) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para eliminar escalas",
    });
  }

  try {
    // Comprobamos si existe el escala que queremos borrar
    const existeEscala = await Escala.findById(uid);
    if (!existeEscala) {
      return res.status(400).json({
        ok: true,
        msg: "La escala no existe",
      });
    }
    // Lo eliminamos y devolvemos el usuaurio recien eliminado
    const resultado = await Escala.findByIdAndRemove(uid);

    res.json({
      ok: true,
      msg: "Escala eliminada",
      resultado: resultado,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error borrando escala",
    });
  }
};

module.exports = { scaleCtrl };
