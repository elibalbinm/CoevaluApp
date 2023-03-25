/*
Importación de módulos
*/
const express = require('express');
const cors    = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const { dbConnection } = require('./database/configdb');

// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
}));

app.use('/api/login', require('./routes/auth.route'));
app.use('/api/asignaturas', require('./routes/asignaturas.route'));
app.use('/api/criterios', require('./routes/criterios.route'));
app.use('/api/cursos', require('./routes/cursos.route'));
app.use('/api/escalas', require('./routes/escalas.route'));
app.use('/api/grupos', require('./routes/grupos.route'));
app.use('/api/items', require('./routes/items.route'));
app.use('/api/evaluaciones', require('./routes/evaluaciones.route'));
app.use('/api/iteraciones', require('./routes/iteracion.route'));
app.use('/api/rubricas', require('./routes/rubricas.route'));
app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/upload', require('./routes/uploads.route'));

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});