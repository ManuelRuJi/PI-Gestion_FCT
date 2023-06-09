import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { AuthService } from '../service/auth.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userid:number|void=0;
  
  constructor(
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private common:CommonService
  ) {}
  
  ngOnInit(): void {
    // Obtener el ID del usuario local desde el Local Storage
    if (this.isLoggedIn()) {
      this.userid=this.idCurrentUser();
    }
    
  }

  isLoggedIn=this.common.isLoggedIn;

  logout=this.common.logout;

  isDocente=this.common.isDocente;

  isAlumno=this.common.isAlumno;

  idCurrentUser(): void {
    //guardamos el rol del usuario en local storage
    this.authservice.getUser().subscribe({
      next: (v) => {
        this.userid = v.usuario.id;
      },
      error: (e) => {
        console.error(e.error.message);
        this.toastr.error(e.error.message,'Fail')
        
        this.logout();
        this.router.navigate(['/login']);
      }
    });
  }
  
}
