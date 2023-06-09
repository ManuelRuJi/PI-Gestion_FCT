import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sede } from '../models/sede';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient : HttpClient) { }

  public listaSede():Observable<Sede>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<Sede>(this.apiURL+"sede",{headers:cabecera});
  }
  public detallesSede(id: number):Observable<Sede>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<Sede>(this.apiURL+`sede/${id}`,{headers:cabecera});
  }

  public crearSede(sede: Request): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }
    console.error(sede);
    
    return this.HttpClient.post<any>(this.apiURL + 'sede/create',sede,{ headers: cabecera });
  }

  public updateSede(id:number,Sede:Request):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }
    console.error(Sede);
    
    return this.HttpClient.put<any>(this.apiURL+`sede/${id}/update`,Sede,{headers:cabecera});
  }

  public borrarSede(id:number):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.delete<any>(this.apiURL+`delete/sede/${id}`,{headers:cabecera});
  }
}
