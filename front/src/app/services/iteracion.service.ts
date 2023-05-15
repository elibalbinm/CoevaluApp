import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Iteracion } from '../models/iteracion.model';

@Injectable({
  providedIn: 'root'
})
export class IteracionService {

  constructor( private http: HttpClient) {  }

  cargarIteracion( uid: string ): Observable<object> {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/iteraciones/${uid}` , this.cabeceras);
  }

  cargarListadoIteraciones(curso: string) {
    if (!curso) { curso = '';}
    return this.http.get(`${environment.base_url}/iteraciones/lista/?curso=${curso}` , this.cabeceras);
  }

  cargarIteraciones( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/iteraciones/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  crearIteracion( data: Iteracion ): Observable<object> {
    return this.http.post(`${environment.base_url}/iteraciones/`, data, this.cabeceras);
  }

  actualizarIteracion(uid: string, data: Iteracion): Observable<object> {
    return this.http.put(`${environment.base_url}/iteraciones/${uid}`, data, this.cabeceras);
  }

  eliminarIteracion (uid) {
    return this.http.delete(`${environment.base_url}/iteraciones/${uid}`, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

}
