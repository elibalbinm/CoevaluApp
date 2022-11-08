import { Criterio } from './criterio.model';
import { Curso } from './curso.model';

export class Rubrica {
    constructor(
        public texto: string,
        public curso: Curso,
        public activo: boolean,
        public criterios?: Criterio[],
        public uid?: string,
    )
    {}
}
