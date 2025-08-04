import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoRequest, RegistroEmpleado } from '../schemas/reporte-empleado.schema';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
     private readonly API_URL = 'http://localhost:8080/api/reporte';

  constructor(private http: HttpClient) {}

  getPeriodosEmpresaTable(periodoRequest: PeriodoRequest): Observable<RegistroEmpleado[]> {
    return this.http.post<RegistroEmpleado[]>(`${this.API_URL}/ver`,periodoRequest);
  }
}
