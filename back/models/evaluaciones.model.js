const { Schema, model } = require('mongoose');

const EvaluacionSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    votaciones: {
        type: Array
    },
    alumno: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }],
    iteracion: [{
        iteracion: {
            type: Schema.Types.ObjectId,
            ref: 'Iteracion'
        }
    }],
    fecha: {
        type: Date,
        require: true,
        default: Date.now
    },
}, { collection: 'evaluaciones' });

EvaluacionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Evaluacion', EvaluacionSchema);