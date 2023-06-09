import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CandidaturaService } from './candidatura.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  constructor(
    private authservice: AuthService,
    private CandidaturaService:CandidaturaService,
    private toastr: ToastrService,
    private router: Router,
    private HttpClient:HttpClient,
  ) {

  }

  isLoggedIn(): boolean {
    const authToken = localStorage.getItem('Authorization');
    
    return authToken != null && authToken != undefined;
  }
  
  isDocente(){
    const rol = localStorage.getItem('rol');
    return rol=="docente" ? true:false
  }

  isAlumno(){
    const rol = localStorage.getItem('rol');
    return rol=="alumno" ? true:false
  }
  logout(){
    this.authservice.logout();
    if (!this.isLoggedIn()) {
      Swal.fire({
        icon: 'success',
        title: 'Logout realizado correctamente',
        showConfirmButton: false,
        timer: 1000
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fallo al intentar cerrar sesión',
        showConfirmButton: false,
        timer: 1000
      })
    }
    this.router.navigate(['/login']);
  }
  
  public idCurrentUser(): Promise<number | void> {
    return new Promise((resolve, reject) => {
      // Guardamos el rol del usuario en local storage
      this.authservice.getUser().subscribe({
        next: (v) => {
          const currentUserid = v.usuario.id;
          resolve(currentUserid);
        },
        error: (e) => {
          this.toastr.error(e.error.mensaje,"Fail")
          this.router.navigate(['/login']);
          reject();
        },
      });
    });
  }

  public idAlumnoCandidatura(idCandidatura: number): Promise<number | void> {
    return new Promise((resolve, reject) => {
      this.CandidaturaService.ShowCandidatura(idCandidatura).subscribe({
        next: (v) => {
          let alumnoid: number;
          if (v.data) {
            try {
              const parsedData = JSON.parse(JSON.stringify(v.data));
              if (parsedData.alumno_id) {
                alumnoid = parsedData.alumno_id;
              } else {
                alumnoid = 0;
              }
            } catch (error) {
              console.error('Error parsing JSON data:', error);
              alumnoid = 0;
            }
          } else {
            alumnoid = 0;
          }
          resolve(alumnoid);
        },
        error: (e) => {
          this.toastr.error(e.error.mensaje, "Fail");
          this.router.navigate(['/login']);
          reject();
        },
      });
    });
  }
}
