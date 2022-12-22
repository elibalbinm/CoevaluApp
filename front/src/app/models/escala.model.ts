import { Criterio } from './criterio.model';

export class Escala {
    constructor(
        public valor: number,
        public nivel: string,
        public descripcion: string,
        public criterio: Criterio,
        public uid?: string,
    )
    {}
}
