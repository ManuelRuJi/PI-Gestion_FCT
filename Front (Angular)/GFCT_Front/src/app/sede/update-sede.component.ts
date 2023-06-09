import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { SedeService } from '../service/sede.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-update-sede',
  templateUrl: './update-sede.component.html',
  styleUrls: ['./update-sede.component.css']
})
export class UpdateSedeComponent {
  plantilla = JSON.stringify({
    id:0,
    nombre: "",
    direccion:"",
    telefono:"",
  });

  datos=JSON.parse(this.plantilla);
  errores: string[] = [];

  constructor(
  private authservice:AuthService,
  private SedeService:SedeService,
  private activatedRouter:ActivatedRoute,
  private toastr: ToastrService,
  private router: Router,
  private common:CommonService) { };


  ngOnInit(){
    const id =this.activatedRouter.snapshot.params['id'];
    
    this.common.idCurrentUser().then((currentUserid: number | void) => {
      if (currentUserid !== undefined && this.common.isDocente()) {
        this.SedeService.detallesSede(id).subscribe({
          next: (v) => {
            this.datos = v.data;
            console.info("Sede: ", this.datos);
          },
          error: (e) => {
            console.error(e.error.message);
            this.toastr.error(e.error.message,'Fail')
            this.common.logout();
            this.router.navigate(['/login']);
          },
          complete: () => console.info('Detalles Cargados'),
        });

      } else {
        this.router.navigate(['/login']);
        this.toastr.error("No puedes acceder, necesitas ser docente", 'Fail');
      }
    });
  }
  submitForm() {
    this.errores = [];

    if (!this.validarDatos()) {
      return;
    }

    console.log(this.datos);
    
    let sede:Request=this.datos;
    
    this.SedeService.updateSede(this.datos.id,sede).subscribe({
      next: (v) => {
        this.toastr.success("Datos actualizados", 'OK');
        this.router.navigate(['/sede/'+v.data.id]);
      },
      error: (e) => {
        if (e.error.hasOwnProperty('mensaje')) {
          // Clave 'mensaje' existe en el objeto de errores
          const mensajeError = e.error.mensaje;
          this.toastr.error(mensajeError, 'FAIL');
          this.router.navigate(['/login']);
        }
      
        if (e.error.hasOwnProperty('error')) {
          const errores = e.error.error; // Objeto de errores
          console.log(errores);
      
          for (let key in errores) {
            if (Array.isArray(errores[key])) { // Verificar si el valor es un arreglo
              errores[key].forEach((mensaje: any) => {
                this.toastr.error(mensaje, 'FAIL');
              });
            }
          }
        }
      },
      complete: () => console.info('Datos Actualizados'),
    });
  }

  validarDatos(): boolean {
    this.errores = [];

    if (!this.datos.nombre) {
      this.errores.push('El nombre es requerido');
    } else if (this.datos.nombre.length > 15) {
      this.errores.push('El nombre debe tener como máximo 15 caracteres');
    }

    if (!this.datos.direccion) {
      this.errores.push('La direccion es requerida');
    } else if (this.datos.direccion.length > 150) {
      this.errores.push('La direccion debe tener como máximo 150 caracteres');
    }

    if (!this.datos.telefono) {
      this.errores.push('El teléfono es requerido');
    }else if (this.datos.telefono < 100000000 || this.datos.telefono > 999999999) {
      this.errores.push('El teléfono debe ser un número válido de 9 dígitos');
    }

    if (!this.datos.empresa_id) {
      this.errores.push('La Empresa es requerida');
    }

    return this.errores.length === 0;
  }
}
