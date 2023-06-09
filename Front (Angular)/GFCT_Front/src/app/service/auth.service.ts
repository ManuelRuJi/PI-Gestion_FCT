import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = 'http://127.0.0.1:8000/api/';

  constructor(private HttpClient: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    /* let cabecera = new HttpHeaders(); 
    let parametros = new HttpParams(); */
    let parametros = {
      "email":email,
      "password":password
    }
    return this.HttpClient.post<User[]>(this.apiURL + 'login', parametros);
  }

  public register(user: Request): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }
    console.error(user);
    
    return this.HttpClient.post<any>(this.apiURL + 'register',user,{ headers: cabecera });
  }

  public getUser(): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");

    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
    } else {
      cabecera = new HttpHeaders();
    }

    return this.HttpClient.get<User>(this.apiURL + 'user',{ headers: cabecera });
  }

  public logout(): Observable<any> {
    let cabecera:HttpHeaders;
    let token = localStorage.getItem("Authorization");
    
    if (token != null) {
      cabecera = new HttpHeaders({'Authorization': `Bearer ${token}`});
      localStorage.removeItem('Authorization');
      localStorage.removeItem('rol');
    } else {
      cabecera = new HttpHeaders();
    }
    return this.HttpClient.post<User[]>(this.apiURL + 'logout',"",{ headers: cabecera });
  }
}
