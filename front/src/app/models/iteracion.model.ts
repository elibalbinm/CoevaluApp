
import { Curso } from './curso.model';

export class Iteracion {

  constructor(
    public curso: Curso,
    public iteracion: number,
    public hito: number,
    public fecha_ini: Date,
    public fecha_fin: Date,
    public fecha_ini_coe: Date,
    public fecha_fin_coe: Date,
    public uid?: string
  )
  {}
}
