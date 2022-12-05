import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RubricaService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/rubricas/lista/${uid}`, data, this.cabeceras);
  }

  crearRubrica(data) {
    return this.http.post(`${environment.base_url}/rubricas/`, data, this.cabeceras);
  }

  totalRubricas (): Observable<object> {
    return this.http.get(`${environment.base_url}/rubricas/total` , this.cabeceras);
  }

  actualizarRubrica(uid: string, data) {
    return this.http.put(`${environment.base_url}/rubricas/${uid}`, data, this.cabeceras);
  }

  cargarRubrica( uid: string) {
    if (uid===undefined) { uid=''}
    return this.http.get(`${environment.base_url}/rubricas/?id=${uid}` , this.cabeceras);
  }

  listaRubricas(desde: number, texto: string, curso: string) {
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
    return this.http.get(`${environment.base_url}/rubricas/?desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  eliminarRubrica(uid: string) {
    return this.http.delete(`${environment.base_url}/rubricas/${uid}`, this.cabeceras);
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
