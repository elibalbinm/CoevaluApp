const { Schema, model } = require('mongoose');

const IteracionSchema = Schema({
    curso: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }],
    hito: {
        type: Number,
        require: true
    },
    fecha_ini: {
        type: Date
    },
    fecha_fin: {
        type: Date
    },
    fecha_inicio_coe: {
        type: Date
    },
    fecha_fin_coe: {
        type: Date
    },
}, { collection: 'iteraciones' });


IteracionSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Iteracion', IteracionSchema);