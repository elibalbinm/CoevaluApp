import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})

export class UserComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    if (this.uid !== 'nuevo') {
      this.usuarioService.cargarUsuario(this.uid)
        .subscribe( res => {
          if (!res['usuarios']) {
            this.router.navigateByUrl('/admin/usuarios');
            return;
          };
          this.cargarDatosForm(res);
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    }
  }

  private formSubmited = false;
  private uid: string = '';
  public enablepass: boolean = true;
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    email: [ '', [Validators.required, Validators.email] ],
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    password: ['', Validators.required ],
    rol: ['ROL_ALUMNO', Validators.required ],
    activo: [true, Validators.required ],
  });

  public nuevoPassword = this.fb.group({
    password: ['', Validators.required],
  });

  cargarDatosForm(res: any): void {
    this.datosForm.get('uid').setValue(res['usuarios'].uid);
    this.datosForm.get('nombre').setValue(res['usuarios'].nombre);
    this.datosForm.get('apellidos').setValue(res['usuarios'].apellidos);
    this.datosForm.get('email').setValue(res['usuarios'].email);
    this.datosForm.get('rol').setValue(res['usuarios'].rol);
    this.datosForm.get('activo').setValue(res['usuarios'].activo);
    this.datosForm.get('password').setValue('1234');
    this.datosForm.get('password').disable();
    this.enablepass = false;
    this.datosForm.markAsPristine();
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    // Diferenciar entre dar de alta uno nuevo o actualizar uno que ya existe
    // Alta de uno nuevo
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.usuarioService.nuevoUsuario( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.get('uid').setValue(res['usuario'].uid);
          this.datosForm.get('password').disable();
          this.enablepass = false;
          this.datosForm.markAsPristine();
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });
    } else {
      // actualizar el usuario
      this.usuarioService.actualizarUsuario( this.datosForm.get('uid').value, this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
    }
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.router.navigateByUrl('/admin/usuarios');
      return;
    } else {
      this.usuarioService.cargarUsuario(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['usuarios']) {
          this.router.navigateByUrl('/admin/usuarios');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargarDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/admin/usuarios');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
    }
  }

}
