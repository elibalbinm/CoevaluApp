import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/evaluaciones/lista/${uid}`, data, this.cabeceras);
  }

  crearEvaluacion(data) {
    return this.http.post(`${environment.base_url}/evaluaciones/`, data, this.cabeceras);
  }

  getValores(valores: any): Observable<Array<any>> {
    return valores
      .pipe()
      .map((response: any[]) => {
        console.log(response);
      });
  }

  getEvaluationByStudent( alumno: string, iteracion?: any ) {
    if (!alumno) alumno = '';
    if (iteracion){
      return this.http.get(`${environment.base_url}/evaluaciones/alumno/?id=${alumno}&iteracion=${iteracion}` , this.cabeceras);
    }else{
      return this.http.get(`${environment.base_url}/evaluaciones/alumno/?id=${alumno}` , this.cabeceras);
    }
  }

  // Funcion de actualizarGrupo: lo que hace es guardar el array de guardarVacio que contiene
  // dimension/criterio y la escala, valor y el alumno al que se vota
  actualizarVotacion(uid: string, data) {
    console.log('Entra a actualizarVotacion de Evaluacion Service: ',data);
    return this.http.put(`${environment.base_url}/evaluaciones/lista/${uid}`, data, this.cabeceras);
  }

  cargarEvaluacion( uid: string) {
    if (uid === undefined) { uid=''}
    return this.http.get(`${environment.base_url}/evaluaciones/?id=${uid}` , this.cabeceras);
  }

  cargarEvaluaciones( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/evaluaciones/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  eliminarEvaluacion(uid: string) {
    return this.http.delete(`${environment.base_url}/evaluaciones/${uid}`, this.cabeceras);
  }

  actualizarAlumnos(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/grupos/lista/${uid}`, data, this.cabeceras);
  }

  get cabeceras(): object {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
}
