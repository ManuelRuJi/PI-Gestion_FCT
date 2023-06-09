import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { ListaUsuarioComponent } from './user/lista-usuario.component';
import { DetalleUsuarioComponent } from './user/detalle-usuario.component';
import { RegisterComponent } from './auth/register.component';
import { EditarUsuarioComponent } from './user/editar-usuario.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

//external
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ListaCandidaturaComponent } from './candidatura/lista-candidatura.component';
import { DetalleCandidaturaComponent } from './candidatura/detalle-candidatura.component';
import { CrearCandidaturaComponent } from './candidatura/crear-candidatura.component';
import { CandidaturaAlumnoComponent } from './candidatura/candidatura-alumno.component';
import { ListaEmpresaComponent } from './empresa/lista-empresa.component';
import { CrearEmpresaComponent } from './empresa/crear-empresa.component';
import { DetalleEmpresaComponent } from './empresa/detalle-empresa.component';
import { UpdateEmpresaComponent } from './empresa/update-empresa.component';
import { UpdateSedeComponent } from './sede/update-sede.component';
import { ListaSedeComponent } from './sede/lista-sede.component';
import { CrearSedeComponent } from './sede/crear-sede.component';
import { DetalleSedeComponent } from './sede/detalle-sede.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ListaUsuarioComponent,
    DetalleUsuarioComponent,
    RegisterComponent,
    EditarUsuarioComponent,
    ListaCandidaturaComponent,
    DetalleCandidaturaComponent,
    CrearCandidaturaComponent,
    CandidaturaAlumnoComponent,
    ListaEmpresaComponent,
    CrearEmpresaComponent,
    DetalleEmpresaComponent,
    UpdateEmpresaComponent,
    UpdateSedeComponent,
    ListaSedeComponent,
    CrearSedeComponent,
    DetalleSedeComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), // ToastrModule added
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
