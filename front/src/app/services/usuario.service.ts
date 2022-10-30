import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { loginForm  } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router ) { }

  login( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login`, formData)
      .pipe(
        tap( (res : any) => {
          localStorage.setItem('token', res['token']);
          const {uid, rol} = res;
          this.usuario = new Usuario(uid, rol);
        })
      );
  }

  get rol(): string {
    return this.usuario.rol;
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
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
}
