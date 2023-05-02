import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { loginForm  } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { EvaluacionService } from './evaluacion.service';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private usuario: Usuario;

  constructor( private evaluacionService: EvaluacionService,
               private http: HttpClient,
               private router: Router ) { }

  login( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login`, formData)
      .pipe(
        tap( (res : any) => {
          localStorage.setItem('token', res['token']);

          // this.evaluacionService.
          // localStorage.setItem('evaluaciones', )
          const {uid, rol} = res;
          this.usuario = new Usuario(uid, rol);
        })
      );
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  cargarListaUsuarios ( uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/lista` , data, this.cabeceras);
  }

  cargarUsuariosRol ( rol: string, uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/rol/${rol}`, data, this.cabeceras);
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  nuevoUsuario ( data: Usuario ) {
    console.log(data);
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  totalRegistros (): Observable<object> {
    return this.http.get(`${environment.base_url}/usuarios/total` , this.cabeceras);
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, apellidos, email, rol, alta, activo, imagen, token} = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, nombre, apellidos, email, alta, activo, imagen);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          // this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  logout(): void {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }

  actualizarUsuario ( uid: string, data: Usuario) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }
}
