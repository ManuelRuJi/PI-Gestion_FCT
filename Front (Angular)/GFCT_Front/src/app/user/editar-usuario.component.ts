import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { makeBindingParser } from '@angular/compiler';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent {
  plantilla = JSON.stringify({
    id:0,
    nombre: "",
    apellidos: "",
    edad: 0,
    email: "",
    dni: "",
    telefono: "",
    rol: "",
    alumno: {
        id: 0,
        CV: "",
        profesor_seguimiento_id: 0,
        profesor: "",
        emailProfesor: ""
    }
  });

  datos=JSON.parse(this.plantilla);
  errores: string[] = [];

  constructor(
  private authservice:AuthService,
  private UsuarioService:UsuarioService,
  private activatedRouter:ActivatedRoute,
  private toastr: ToastrService,
  private router: Router,
  private common:CommonService) { };


  ngOnInit(){
    const id =this.activatedRouter.snapshot.params['id'];
    
    this.common.idCurrentUser().then((currentUserid: number | void) => {
      if (currentUserid !== undefined && (this.common.isDocente() || currentUserid == id)) {
        this.UsuarioService.detalles(id).subscribe({
          next: (v) => {
            this.datos = v.data;
            console.info("usuario: ", this.datos);
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
        this.toastr.error("No puedes Acceder a datos de otros Alumnos", 'FAIL');
      }
    });
  }
  submitForm() {
    this.errores = [];

    if (!this.validarDatos()) {
      return;
    }

    console.log(this.datos);
    
    let usuario:Request=this.datos;

    this.UsuarioService.update(this.datos.id,usuario).subscribe({
      next: (v) => {
        console.log(v.data);
        this.toastr.success("Datos actualizados", 'OK');
        this.router.navigate(['/usuario/'+v.data.id]);
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
    }

    if (!this.datos.apellidos) {
      this.errores.push('Los apellidos son requeridos');
    }

    if (!this.datos.edad) {
      this.errores.push('La edad es requerida');
    }else if(this.datos.edad<10){
      this.errores.push('La edad debe ser mayor que 10');
    }

    if (!this.datos.email) {
      this.errores.push('El email es requerido');
    } else if (!this.validarEmail(this.datos.email)) {
      this.errores.push('El email no es válido');
    }

    if (!this.datos.dni) {
      this.errores.push('El DNI es requerido');
    } else if (!this.validarDni(this.datos.dni)) {
      this.errores.push('El DNI no es válido');
    }

    if (this.datos.telefono && (this.datos.telefono < 100000000 || this.datos.telefono > 999999999)) {
      this.errores.push('El teléfono debe ser un número válido de 9 dígitos');
    }

    if (!this.datos.rol) {
      this.errores.push('El rol es requerido');
    } else if (this.datos.rol !== 'docente' && this.datos.rol !== 'alumno') {
      this.errores.push('El rol seleccionado no es válido');
    }

    return this.errores.length === 0;
  }

  validarEmail(email: string): boolean {
    // Utiliza una expresión regular para validar el formato del email
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  validarDni(dni: string): boolean {
    // Utiliza una expresión regular para validar el formato del DNI
    const pattern = /^\d{8}[A-Z]$/;
    return pattern.test(dni);
  }
}
