import { Injectable } from '@angular/core';
import { PeriodoEmpleadoResponseBin } from '../schemas/periodoEmpleado.schema';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {
     private readonly API_URL = 'http://localhost:8080/api/periodo-empresa';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los periodos activos de empleados para una empresa.
   * @returns Observable con un array de PeriodoEmpleadoResponseBin
   */
  getPeriodosEmpresa(): Observable<PeriodoEmpleadoResponseBin[]> {
    return this.http.get<PeriodoEmpleadoResponseBin[]>(`${this.API_URL}/list`);
  }
}
