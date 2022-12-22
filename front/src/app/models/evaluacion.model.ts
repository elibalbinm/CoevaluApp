import { Usuario } from './usuario.model';
import { Iteracion } from './iteracion.model';

export class Evaluacion {
    constructor(
        public valores: [],
        public alumno: Usuario,
        public iteracion: Iteracion,
        public fecha: Date,
        public uid?: string,
    )
    {}
}
