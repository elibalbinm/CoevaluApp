const { Schema, model } = require('mongoose');

const RubricaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    proyecto: {
        type: String,
        require: true
    },
    curso: [{
        curso: {
            type: Schema.Types.ObjectId,
            ref: 'Curso'
        }
    }],
    alumnos: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }],
    activo: {
        type: Boolean,
        require: true
    },
    criterios: [{
        criterio: {
            type: Schema.Types.ObjectId,
            ref: 'Criterio'
        }
    }],
}, { collection: 'rubricas' });


RubricaSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Rubrica', RubricaSchema);