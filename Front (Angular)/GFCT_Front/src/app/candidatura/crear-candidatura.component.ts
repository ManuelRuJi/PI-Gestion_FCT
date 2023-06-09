import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { CandidaturaService } from '../service/candidatura.service';
import { EmpresaService } from '../service/empresa.service';
import { AlumnoService } from '../service/alumno.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-crear-candidatura',
  templateUrl: './crear-candidatura.component.html',
  styleUrls: ['./crear-candidatura.component.css']
})
export class CrearCandidaturaComponent {
  plantilla = JSON.stringify({
    empresa:{

    },
    alumno:{

    }
  });

  datos=JSON.parse(this.plantilla);
  errores: string[] = [];

  constructor(
  private authservice:AuthService,
  private CandidaturaService:CandidaturaService,
  private EmpresaService:EmpresaService,
  private AlumnoService:AlumnoService,
  private toastr: ToastrService,
  private router: Router,
  private common:CommonService) { };


  ngOnInit(){
    this.common.idCurrentUser().then((currentUserid: number | void) => {
      if (currentUserid === undefined || !this.common.isDocente()) {
        this.router.navigate(['/login']);
        this.toastr.error("No tienes permiso para esto.", 'Fail');
      }else{
        this.EmpresaService.listaEmpresa().subscribe({
          next: (v) => {
            this.datos.empresa = v.data;
            console.info("Empresas: ", this.datos);
          },
          error: (e) => {
            if (e.error.hasOwnProperty('mensaje')) {
              // Clave 'mensaje' existe en el objeto de errores
              const mensajeError = e.error.mensaje;
              this.toastr.error(mensajeError, 'FAIL');
              this.router.navigate(['/login']);
            }
          }
        });
        this.AlumnoService.listaAlumno().subscribe({
          next: (v) => {
            this.datos.alumno = v.data;
            console.info("Alumnos: ", this.datos);
          },
          error: (e) => {
            if (e.error.hasOwnProperty('mensaje')) {
              // Clave 'mensaje' existe en el objeto de errores
              const mensajeError = e.error.mensaje;
              this.toastr.error(mensajeError, 'FAIL');
              this.router.navigate(['/login']);
            }
          }
        });
      }
    });
  }
  submitForm() {
    this.errores = [];

    if (!this.validarDatos()) {
      return;
    }

    console.log(this.datos);

    let candidatura:Request=this.datos;

    this.CandidaturaService.crearCandidatura(candidatura).subscribe({
      next: (v) => {
        console.log(v.data);
        this.toastr.success("Candidatura creado correctamente", 'OK');
        this.router.navigate(['candidatura']);
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
      
          if (Array.isArray(errores)) {
            for (let key in errores) {
              if (Array.isArray(errores[key])) { // Verificar si el valor es un arreglo
                errores[key].forEach((mensaje: any) => {
                  this.toastr.error(mensaje, 'FAIL');
                });
              }
            }
          } else {
            this.toastr.error(errores, 'FAIL');
          }
        }
      },
      complete: () => console.info('Datos Actualizados'),
    });
  }

  validarDatos(): boolean {
    this.errores = [];

    if (!this.datos.empresa_id) {
      this.errores.push('La empresa es requerida');
    }

    if (!this.datos.alumno_id) {
      this.errores.push('El alumno es requerido');
    }

    return this.errores.length === 0;
  }
}
