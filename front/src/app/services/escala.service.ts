import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escala } from '../models/escala.model';

@Injectable({
  providedIn: 'root'
})
export class EscalaService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/escalas/lista/${uid}`, data, this.cabeceras);
  }

  crearEscala(data) {
    return this.http.post(`${environment.base_url}/escalas/`, data, this.cabeceras);
  }

  actualizarEscala(uid: string, data) {
    return this.http.put(`${environment.base_url}/escalas/${uid}`, data, this.cabeceras);
  }

  cargarEscala( uid: string ) {
    if (uid === undefined) { uid=''}
    return this.http.get(`${environment.base_url}/escalas/?id=${uid}` , this.cabeceras);
  }

  cargarEscalas( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/escalas/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  cargarEscalasPorCriterio( uid: string ): Observable<Escala[]> {
    if (!uid) uid = '';
    console.log('ID: ',uid);
    console.log(this.cabeceras)
    return this.http.get<Escala[]>(`${environment.base_url}/escalas/${uid}` , this.cabeceras);
  }

  listaAsignaturas(desde: number, texto: string, curso: string) {
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!curso) {
      curso = '';
    } else {
      curso = `&curso=${curso}`;
    }
    return this.http.get(`${environment.base_url}/escalas/?desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  eliminarEscala(uid: string) {
    return this.http.delete(`${environment.base_url}/escalas/${uid}`, this.cabeceras);
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