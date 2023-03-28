import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/criterios/lista/${uid}`, data, this.cabeceras);
  }

  crearCriterio(data) {
    return this.http.post(`${environment.base_url}/criterios/`, data, this.cabeceras);
  }

  actualizarCriterio(uid: string, data) {
    return this.http.put(`${environment.base_url}/criterios/${uid}`, data, this.cabeceras);
  }

  cargarCriterio( uid: string) {
    if (uid === undefined) { uid=''}
    return this.http.get(`${environment.base_url}/criterios/?id=${uid}` , this.cabeceras);
  }

  cargarCriterios( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/criterios/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  cargarEscalasPorCriterio( uid: string ): Observable<object> {
    if (!uid) { uid = '';}
    return this.http.post(`${environment.base_url}/escalas/${uid}` , this.cabeceras);
    console.log('Finaliza')
  }

  cargarAlumnos( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
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
    return this.http.get(`${environment.base_url}/criterios/?desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  eliminarCriterio(uid: string) {
    return this.http.delete(`${environment.base_url}/criterios/${uid}`, this.cabeceras);
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
