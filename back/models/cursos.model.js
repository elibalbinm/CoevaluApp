const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    nombrecorto: {
        type: String,
        require: true,
        unique: true
    },
    rubrica: {
        type: Schema.Types.ObjectId,
        ref: 'Rubrica',
        require: true
    },
    fecha_ini: {
        type: Date,
        require: true,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
        require: true,
        default: Date.now
    },
    porcentaje: {
        type: Number,
        require: true
    },
    activo: {
        type: Boolean,
        require: true,
        default: true
    }
}, { collection: 'cursos' });

CursoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Curso', CursoSchema);