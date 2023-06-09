import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  token: string = '';

  constructor(
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {}

  onLogin(): void {
    try {
      this.authservice.login(this.email, this.password).subscribe({
        next: (v) => {
          localStorage.setItem('Authorization', v.token);
          this.token = v.token;
          console.log(v);
          this.guardarRol();
          Swal.fire({
            icon: 'success',
            title: 'Te has logeado con exito',
            showConfirmButton: false,
            timer: 1000
          })
        },
        error: (e) => {
          
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Tus credenciales son incorrectas",
              showConfirmButton: false,
              timer: 1500
            })
          }
        
          if (e.error.hasOwnProperty('error')) {
            if (e.error.error.hasOwnProperty('email')) {
              // Clave 'error.email' existe en el objeto de errores
              const errorEmail = e.error.error['email'];
              errorEmail.forEach((element: string | undefined) => {
                this.toastr.error(element, 'FAIL');
                console.error(element);
              });
            } else {
              // Clave 'error.password' existe en el objeto de errores
              const errorPassword = e.error.error['password'];
              errorPassword.forEach((element: string | undefined) => {
                this.toastr.error(element, 'FAIL');
                console.error(element);
              });
            }
          }
          this.router.navigate(['/login']);
        },
        complete: () => console.info('complete login'),
      });
    } catch (error) {
      this.toastr.error("Fallo al iniciar sesión", 'FAIL');
    }
  }
  
  public guardarRol(): void {
    //guardamos el rol del usuario en local storage
    this.authservice.getUser().subscribe({
      next: (v) => {
        let usuario = v.usuario;
        console.log('Usuario logeado:' + JSON.stringify(usuario));
        localStorage.setItem('rol', `${usuario.rol}`);
        if (usuario.rol=="docente") {
          this.router.navigate(['']);
        } else {
          this.router.navigate([`usuario/${usuario.id}`]);
        }
      },
      error: (e) => {
        console.error(e.error.mensaje);
        this.router.navigate(['/login']);
      },
    });
    
  }
}
