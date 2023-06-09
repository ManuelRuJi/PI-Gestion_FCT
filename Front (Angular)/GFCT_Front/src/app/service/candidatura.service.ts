import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candidatura } from '../models/candidatura';

@Injectable({
  providedIn: 'root'
})
export class CandidaturaService {

  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient: HttpClient) { }

  public ListaCandidatura(): Observable<Candidatura> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<any>(this.apiURL + 'candidatura',{headers:cabecera});
  }

  public candidaturasAlumno(userId:number): Observable<Candidatura> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<any>(this.apiURL + 'candidatura/alumno/'+userId,{headers:cabecera});
  }

  public ShowCandidatura(CandidaturaId:number): Observable<Candidatura> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<any>(this.apiURL + 'candidatura/'+CandidaturaId,{headers:cabecera});
  }

  borrarCandidatura(CandidaturaId:number){
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.delete(`${this.apiURL}delete/candidatura/${CandidaturaId}`,{headers:cabecera});

  }

  cambiarEstado(nuevoEstado: string,CandidaturaId:number) {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.patch(`${this.apiURL}candidatura/${CandidaturaId}/estado`, { estado: nuevoEstado },{headers:cabecera});
  }
  
  public crearCandidatura(empresa: Request): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }    
    return this.HttpClient.post<any>(this.apiURL + 'candidatura/create',empresa,{ headers: cabecera });
  }
}
