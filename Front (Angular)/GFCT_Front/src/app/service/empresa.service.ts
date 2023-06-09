import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient : HttpClient) { }

  public listaEmpresa():Observable<Empresa>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<Empresa>(this.apiURL+"empresa",{headers:cabecera});
  }
  public detallesEmpresa(id: number):Observable<Empresa>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<Empresa>(this.apiURL+`empresa/${id}`,{headers:cabecera});
  }

  public crearEmpresa(empresa: Request): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }
    console.error(empresa);
    
    return this.HttpClient.post<any>(this.apiURL + 'empresa/create',empresa,{ headers: cabecera });
  }

  public updateEmpresa(id:number,Empresa:Request):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.put<any>(this.apiURL+`empresa/${id}/update`,Empresa,{headers:cabecera});
  }

  public borrarEmpresa(id:number):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.delete<any>(this.apiURL+`delete/empresa/${id}`,{headers:cabecera});
  }
}
