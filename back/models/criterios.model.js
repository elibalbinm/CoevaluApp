const { Schema, model } = require('mongoose');

const CriterioSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true
    },
    activo: {
        type: Boolean,
        require: true,
        default: true
    },
    // escala: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Criterio',
    //     require: true
    // },
}, { collection: 'criterios' });

CriterioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Criterio', CriterioSchema);