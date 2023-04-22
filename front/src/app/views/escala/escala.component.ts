import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Criterio } from 'src/app/models/criterio.model';
import { CriterioService } from 'src/app/services/criterio.service';
import { EscalaService } from 'src/app/services/escala.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escala',
  templateUrl: './escala.component.html'
})
export class EscalaComponent implements OnInit {

  public nombre = false;
  public submited = false;
  public criterios: Criterio[] = [];
  public uid: string = 'nuevo';

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    valor: ['', Validators.required ],
    nivel: ['', [Validators.required, Validators.min(1), Validators.max(10)] ],
    descripcion: ['', Validators.required ],
    criterio: ['', Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private escalaService: EscalaService,
    private criterioService: CriterioService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.cargarCriterios();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos();

    if(this.uid === 'nuevo'){
      this.nombre = true;
      this.datosForm.reset();
    }
  }

  cargarCriterios() {
    this.criterioService.cargarCriterios(0, '')
      .subscribe( res => {
        console.log(res);
        this.criterios = res['criterios'];
      });
  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.escalaService.cargarEscala(this.uid)
        .subscribe( res => {
          if (!res['escalas']) {
            this.router.navigateByUrl('/admin/escalas');
            return;
          };
          this.datosForm.get('valor').setValue(res['escalas'].valor);
          this.datosForm.get('nivel').setValue(res['escalas'].nivel);
          this.datosForm.get('descripcion').setValue(res['escalas'].descripcion);
          this.datosForm.get('criterio').setValue(res['escalas'].criterio._id);
          this.datosForm.markAsPristine();
          this.uid = res['escalas'].uid;
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/escalas');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('valor').setValue('');
      this.datosForm.get('nivel').setValue('');
      this.datosForm.get('descripcion').setValue('');
      this.datosForm.get('criterio').setValue('');
      this.datosForm.markAsPristine();
    }
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
  }

  enviar() {
    console.log('Entra')
    this.submited = true;
    console.log(this.datosForm)
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.escalaService.crearEscala( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['escala'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
          Swal.fire({
            title: 'Nuevo Grupo',
            text: 'El escala' + res['escala'].nombre + ' ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.escalaService.actualizarEscala( this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  cancelar() {
    this.router.navigateByUrl('/admin/escalas');
  }

}
