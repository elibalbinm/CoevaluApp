import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})

export class UserComponent implements OnInit {

  public nombre = false;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer2: Renderer2) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    console.log('ID: ' + this.uid);
    if (this.uid === 'new') {
      this.nombre = true;
      this.datosForm.reset();
    }else{
      this.usuarioService.cargarUsuario(this.uid)
      .subscribe( res => {
        if (!res['usuarios']) {
          this.router.navigateByUrl('/admin/users');
          return;
        };
        this.cargarDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/admin/users');
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
    uid: [{value: 'new', disabled: true}, Validators.required],
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

  cambiarPassword(){
    // ponemos el mismo valor en los tres campos
    const data = {
      password : this.nuevoPassword.get('password').value,
      nuevopassword: this.nuevoPassword.get('password').value,
      nuevopassword2: this.nuevoPassword.get('password').value
    };
    this.usuarioService.cambiarPassword( this.datosForm.get('uid').value, data)
      .subscribe(res => {
        this.nuevoPassword.reset();
        this.showOKP = true;
        Swal.fire({
          title: 'Contraseña actualizada',
          text: 'La contraseña ha sido a actualizada correctamente',
          icon: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
      }, (err)=>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  nuevo(): void {
    // this.formSubmited = false;
    this.formSubmited = false;
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    this.datosForm.get('rol').setValue('ROL_CLIENTE');
    this.datosForm.get('password').enable();
    this.enablepass = true;
  }

  esnuevo(): void {
      this.nombre = true;
      this.datosForm.reset();
  }

  enviar(): void {
    console.log('Entra')
    this.formSubmited = true;

    console.log(this.datosForm.get('uid').value);

    // if (this.datosForm.invalid) { return; }
    // Diferenciar entre dar de alta uno nuevo o actualizar uno que ya existe
    // Alta de uno nuevo
    if (this.datosForm.get('uid').value === 'new') {
      console.log('Entra x2')
      this.datosForm.get('uid').setValue('nuevo');
      this.datosForm.get('password').setValue('1234');
      // this.nuevo();
      this.usuarioService.nuevoUsuario( this.datosForm.value )
        .subscribe( res => {
          console.log(JSON.stringify(res))
          this.datosForm.get('uid').setValue(res['usuario'].uid);
          this.datosForm.get('password').disable();
          this.enablepass = false;
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nuevo usuario',
            text: 'El usuario ' + res['usuario'].nombre + ' ' + res['usuario'].apellidos + ' ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          this.datosForm.reset();
          this.router.navigateByUrl('/admin/users/user/new');

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
          Swal.fire({
            title: 'Datos modificados',
            text: 'El usuario ' + res['usuario'].nombre + ' ' + res['usuario'].apellidos + ' ha sido modificado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
    }
  }

  cancelar(): void {
    console.log('Entra')
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'new') {
      console.log('Entra')
      this.router.navigateByUrl('/admin/users');
      return;
    } else {
      this.usuarioService.cargarUsuario(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['usuarios']) {
          this.router.navigateByUrl('/admin/users/');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargarDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/admin/users');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
    }
  }

}
