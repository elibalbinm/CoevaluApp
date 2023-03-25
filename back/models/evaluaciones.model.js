const { Schema, model } = require('mongoose');

const EvaluacionSchema = Schema({
    votaciones: [
        {
            // valores: [
            //     {    
                    alumno_votado: {
                        type: Schema.Types.ObjectId,
                        ref: 'Usuario',
                        required: true
                    },
                    escala: {
                        type: Schema.Types.ObjectId,
                        ref: 'Escala',
                        required: true
                    }, 
                    valor: {
                        type: Number,
                        required: true
                    } 
            //     }
            // ] 
        }
    ],
    //Dimension
    criterio: {
        type: Schema.Types.ObjectId,
        ref: 'Criterio',
        required: true
    },
    alumno: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    iteracion: {
        type: Schema.Types.ObjectId,
        ref: 'Iteracion',
        require: true
    },
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