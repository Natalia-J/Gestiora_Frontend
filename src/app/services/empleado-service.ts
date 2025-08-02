import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = 'http://localhost:8080/api/empleado';

  constructor(private http: HttpClient) {}

  crearEmpleado(empleadoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, empleadoData);
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  obtenerPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }
}
