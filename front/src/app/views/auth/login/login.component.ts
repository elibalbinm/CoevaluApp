import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})

export class LoginComponent implements OnInit {
  constructor( private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router ) { }

  public formSubmint = false;
  public waiting = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [ false || localStorage.getItem('email') ]
  });

  ngOnInit(): void {}

  login() {
    this.formSubmint = true;
    if (!this.loginForm.valid) {
      console.warn('Errores en le formulario');
      return;
    }
    this.waiting = true;
    this.usuarioService.login( this.loginForm.value)
      .subscribe( res => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        this.waiting = false;
        switch (this.usuarioService.rol) {
          case 'ROL_ADMIN':
            this.router.navigateByUrl('/admin/dashboard');
            break;
          case 'ROL_ALUMNO':
            this.router.navigateByUrl('/alu/dashboard');
            break;
          case 'ROL_PROFESOR':
            this.router.navigateByUrl('/prof/dashboard');
            break;
        }

      }, (err) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      });

  }

  // campoValido(campo: string) {
  //   return this.loginForm.get(campo).valid || !this.formSubmint;
  // }
}
