import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../shared/schemas/login-request.schema';

export interface LoginResponse{
  accessToken: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:8080/api/clients'

  constructor(private http: HttpClient) {}
  

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.api}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.accessToken)
      })
    );
  }
  

  register(data: {username:string, password:string, mail:string}){
    return this.http.post<any>(`${this.api}/register`, data)
  }

  saveToken(token:string){
    localStorage.setItem('jwt', token)
  }

  getoken(): string | null {
    return localStorage.getItem('jwt')
  }

  logout(){
    localStorage.removeItem('jwt')
  }
}
