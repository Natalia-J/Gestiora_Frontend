import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeriodoRequest, RegistroEmpleado } from '../schemas/reporte-empleado.schema';
import { Observable } from 'rxjs';
import { PrenominaRequest } from '../schemas/prenomina-Empleados.schemas';

@Injectable({
  providedIn: 'root'
})
export class PrenominaService {
    private readonly API_URL = 'http://localhost:8080/api/prenomina';

  constructor(private http: HttpClient) {}

  guardarPrenomina(empleadoId: number, tipoPeriodoId: number, prenominaRequest: PrenominaRequest): Observable<void> {
    const url = `${this.API_URL}/guardar/${empleadoId}?tipoPeriodoId=${tipoPeriodoId}`;
    return this.http.post<void>(url, prenominaRequest);
  }
}