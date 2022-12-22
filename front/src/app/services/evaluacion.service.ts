import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  actualizarEvaluacion(uid: string, data) {
    return this.http.put(`${environment.base_url}/evaluaciones/${uid}`, data, this.cabeceras);
  }

  cargarEvaluacion( uid: string) {
    if (uid===undefined) { uid=''}
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
