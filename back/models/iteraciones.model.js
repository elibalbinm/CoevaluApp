const { Schema, model } = require('mongoose');

const IteracionSchema = Schema({
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    rubrica: {
        type: Schema.Types.ObjectId,
        ref: 'Rubrica',
        require: true
    },
    iteracion: {
        type: Number,
        default: 0,
        require: true
    },
    hito: {
        type: Number,
        default: 0,
        require: true
    },
    fecha_ini: {
        type: Date,
        require: true
    },
    fecha_fin: {
        type: Date,
        require: true
    },
    fecha_ini_coe: {
        type: Date,
        require: true
    },
    fecha_fin_coe: {
        type: Date,
        require: true
    },
}, { collection: 'iteraciones' });


IteracionSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Iteracion', IteracionSchema);