import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient : HttpClient) { }

  public listaUsuario():Observable<User>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<User>(this.apiURL+"usuario",{headers:cabecera});
  }
  public listaDocente():Observable<User>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<User>(this.apiURL+"docente",{headers:cabecera});
  }

  public detalles(id: number):Observable<User>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<User>(this.apiURL+`usuario/${id}`,{headers:cabecera});
  }

  public update(id:number,user:Request):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.put<any>(this.apiURL+`usuario/${id}/update`,user,{headers:cabecera});
  }

  public borrarUsuario(id:number):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.delete<any>(this.apiURL+`delete/docente/${id}`,{headers:cabecera});
  }
}
