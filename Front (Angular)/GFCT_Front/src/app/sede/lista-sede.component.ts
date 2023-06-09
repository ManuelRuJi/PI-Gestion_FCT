import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { SedeService } from '../service/sede.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-lista-sede',
  templateUrl: './lista-sede.component.html',
  styleUrls: ['./lista-sede.component.css']
})
export class ListaSedeComponent {
  plantilla = JSON.stringify({
    nombre: "",
    direccion: "",
    telefono: 0,
    empresa_id:""
  });

  datos=JSON.parse(this.plantilla);

  currentUserid:number|void=0;

  constructor(
    private authservice:AuthService,
    private SedeService:SedeService,
    private toastr: ToastrService,
    private router: Router,
    private common:CommonService) { };
  
    ngOnInit(){
      if (!this.isLoggedIn()) {
        this.router.navigate(['/login']);
        this.toastr.error("Necesitas estar Conectado", 'Fail');
      }else{
        this.idCurrentUser().then((currentUserid: number | void) => {
          if (currentUserid !== undefined && this.common.isDocente()){
            this.cargarSede();
          } else {
            this.router.navigate(['/login']);
            this.toastr.error("No puedes Acceder, necesitas ser profesor", 'FAIL');
          }
        });
      }
    }

    cargarSede():void{
      this.SedeService.listaSede().subscribe({
        next: (v) => {
          this.datos = v.data;
          console.info("Sedes: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Lista Sedes Cargada'),
      });
    }
    borrarSede(id:number){
      Swal.fire({
        title: '¿Seguro que quieres eliminar esta sede?',
        showDenyButton: true,
        confirmButtonText: 'Estoy seguro',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.SedeService.borrarSede(id).subscribe({
            next: (v) => {
              Swal.fire({
                icon: 'success',
                title: 'Sede Borrada',
                showConfirmButton: false,
                timer: 1500
              })
              this.cargarSede();
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
              }
            },
            complete: () => console.info('Sede borrada'),
          });
          
        } else if (result.isDenied) {
          Swal.fire('Has cancelado el borrado de una sede', '', 'info')
        }
      })
    }

    public idCurrentUser= this.common.idCurrentUser;
  
    public isAlumno= this.common.isAlumno;
    public isDocente= this.common.isDocente;
  
    public isLoggedIn= this.common.isLoggedIn;
}
