import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { EmpresaService } from '../service/empresa.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-update-empresa',
  templateUrl: './update-empresa.component.html',
  styleUrls: ['./update-empresa.component.css']
})
export class UpdateEmpresaComponent {
  plantilla = JSON.stringify({
    id:0,
    nombre: "",
    cif:"",
    num_empleado:"",
  });

  datos=JSON.parse(this.plantilla);
  errores: string[] = [];

  constructor(
  private authservice:AuthService,
  private EmpresaService:EmpresaService,
  private activatedRouter:ActivatedRoute,
  private toastr: ToastrService,
  private router: Router,
  private common:CommonService) { };


  ngOnInit(){
    const id =this.activatedRouter.snapshot.params['id'];
    
    this.common.idCurrentUser().then((currentUserid: number | void) => {
      if (currentUserid !== undefined && this.common.isDocente()) {
        this.EmpresaService.detallesEmpresa(id).subscribe({
          next: (v) => {
            this.datos = v.data;
            console.info("Empresa: ", this.datos);
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
    
    let empresa:Request=this.datos;

    this.EmpresaService.updateEmpresa(this.datos.id,empresa).subscribe({
      next: (v) => {
        console.log(v.data);
        this.toastr.success("Datos actualizados", 'OK');
        this.router.navigate(['/empresa/'+v.data.id]);
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

    if (!this.datos.cif) {
      this.errores.push('El CIF es requerido');
    } else if (!this.validarCif(this.datos.cif)) {
      this.errores.push('El CIF no es válido');
    }

    if (!this.datos.num_empleado) {
      this.errores.push('El número de empleado es requerido');
    } else if (this.datos.num_empleado < 0 || this.datos.num_empleado > 999999) {
      this.errores.push('El número de empleado debe estar entre 0 y 999999');
    }

    return this.errores.length === 0;
  }
  validarCif(cif: string): boolean {
    // Utiliza una expresión regular para validar el formato del CIF
    const pattern = /^[A-Z]\d{8}$/;
    return pattern.test(cif);
  }
  
}
