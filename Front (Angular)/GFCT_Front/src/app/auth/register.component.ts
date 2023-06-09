import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  plantilla = JSON.stringify({
    nombre: "",
    apellidos: "",
    edad: "",
    email: "",
    password: "",
    dni:"",
    telefono: "",
    rol: "docente"
});

  datos=JSON.parse(this.plantilla);
  errores: string[] = [];

  constructor(
  private authservice:AuthService,
  private toastr: ToastrService,
  private router: Router,
  private common:CommonService) { };


  ngOnInit(){
    this.common.idCurrentUser().then((currentUserid: number | void) => {
      if (currentUserid === undefined || !this.common.isDocente()) {
        this.router.navigate(['/login']);
        this.toastr.error("No tienes permiso para esto.", 'Fail');
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

    this.authservice.register(usuario).subscribe({
      next: (v) => {
        console.log(v.data);
        this.toastr.success("Usuario creado correctamente", 'OK');
        this.router.navigate(['']);
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

    if (!this.datos.password) {
      this.errores.push('La contraseña es requerida');
    } else if (this.datos.password.length < 6 || this.datos.password.length > 50) {
      this.errores.push('La contraseña debe tener entre 6 y 50 caracteres');
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
