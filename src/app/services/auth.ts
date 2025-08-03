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
    return this.http.post<LoginResponse>(`${this.api}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.accessToken);
      })
    );
  }

  register(data: { username: string, password: string, email: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/register`, data).pipe(
      tap(response => this.saveToken(response.accessToken))
    );
  }

  saveToken(token:string){
    localStorage.setItem('token', token)
  }

  getoken(): string | null {
    return localStorage.getItem('token')
  }

  logout(){
    localStorage.removeItem('token')
  }
}
