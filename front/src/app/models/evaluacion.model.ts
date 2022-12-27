import { Usuario } from './usuario.model';
import { Iteracion } from './iteracion.model';

export class Evaluacion {
    constructor(
        public alumno: Usuario,
        public iteracion: Iteracion,
        public fecha: Date,
        public votaciones: {
                            usuario:string,
                            valores: [
                              {
                                criterio: string,
                                escala: string,
                                valor: number
                              }
                            ]
                          }[],
        public uid?: string,
    )
    {}
}
