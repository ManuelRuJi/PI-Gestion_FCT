import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient: HttpClient) {}

  public updateCV(userId:number,selectedFile:File): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }
    const formData = new FormData();
    formData.append('cv', selectedFile);

    return this.HttpClient.post<any>(this.apiURL + 'alumno/subirCV/'+userId, formData,{headers:cabecera});
  }

  public getCV(userId:number): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<any>(this.apiURL + 'alumno/getCV/'+userId,{headers:cabecera,responseType: 'blob' as 'json'});
  }

  public listaAlumno():Observable<Alumno>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<Alumno>(this.apiURL+"alumno",{headers:cabecera});
  }

  public borrarAlumno(id:number):Observable<any>{
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
        
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.delete<any>(this.apiURL+`delete/alumno/${id}`,{headers:cabecera});
  }
}
