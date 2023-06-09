import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { EmpresaService } from '../service/empresa.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-lista-empresa',
  templateUrl: './lista-empresa.component.html',
  styleUrls: ['./lista-empresa.component.css']
})
export class ListaEmpresaComponent {
  plantilla = JSON.stringify({
    nombre: "",
    cif: "",
    num_empleado: 0,
  });

  datos=JSON.parse(this.plantilla);

  currentUserid:number|void=0;

  constructor(
    private authservice:AuthService,
    private EmpresaService:EmpresaService,
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
            this.cargarEmpresa();
          } else {
            this.router.navigate(['/login']);
            this.toastr.error("No puedes Acceder, necesitas ser profesor", 'FAIL');
          }
        });
      }
    }

    cargarEmpresa():void{
      this.EmpresaService.listaEmpresa().subscribe({
        next: (v) => {
          this.datos = v.data;
          console.info("Empresas: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Lista Usuarios Cargada'),
      });
    }
    borrarEmpresa(id:number){
      Swal.fire({
        title: '¿Seguro que quieres eliminar esta empresa?',
        showDenyButton: true,
        confirmButtonText: 'Estoy seguro',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.EmpresaService.borrarEmpresa(id).subscribe({
            next: (v) => {
              Swal.fire({
                icon: 'success',
                title: 'Empresa Borrada',
                showConfirmButton: false,
                timer: 1500
              })
              this.cargarEmpresa();
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
              }
            },
            complete: () => console.info('Empresa borrada'),
          });
          
        } else if (result.isDenied) {
          Swal.fire('Has cancelado el borrado de una empresa', '', 'info')
        }
      })
    }

    public idCurrentUser= this.common.idCurrentUser;
  
    public isAlumno= this.common.isAlumno;
    public isDocente= this.common.isDocente;
  
    public isLoggedIn= this.common.isLoggedIn;
}
