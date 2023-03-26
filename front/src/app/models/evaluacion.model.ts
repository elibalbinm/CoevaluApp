import { Usuario } from './usuario.model';
import { Iteracion } from './iteracion.model';
import { Criterio } from './criterio.model';
import { Escala } from './escala.model';

export class Evaluacion {
    constructor(
      public valores: {
        criterio: Criterio,
        votaciones: [
          {
            alumno_votado: Usuario,
            escala: Escala,
            valor: number
          }
        ]
      }[],
        public alumno: Usuario,
        public iteracion: Iteracion,
        // public criterio: Criterio,
        public fecha: Date,
        public uid?: string,
    )
    {}
}
