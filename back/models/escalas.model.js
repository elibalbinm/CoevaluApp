const { Schema, model } = require('mongoose');

const EscalaSchema = Schema({
    nivel: {
        type: String,
        require: true
    },
    descripcion: {
        type: String
    },
    // proyectodes: {
    //     type: String
    // },
    criterio: {
        type: Schema.Types.ObjectId,
        ref: 'Criterio',
        require: true
    },
    valoracion: {
        type: Number
    }
}, { collection: 'escalas' });

EscalaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Escala', EscalaSchema);