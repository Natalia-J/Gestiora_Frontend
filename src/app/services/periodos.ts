import { Injectable } from '@angular/core';
import { PeriodoEmpleadoResponseBin } from '../schemas/periodoEmpleado.schema';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PeriodoEmpresaRequest {
  periodoEmpresaId?: number;
  fechaInicio: string; 
}

export interface PeriodoEmpresaResponse {
    periodoId: number;
    fechaInicio: string;
    fechaFin: string;
    tipoPeriodo: string;
    estado: boolean;
    empresa: string;
}

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

    /**
   * Crea o actualiza un periodo empresa.
   * @param request Objeto con los datos para crear o actualizar.
   * @returns Observable con la respuesta del periodo creado o actualizado.
   */
  crearPeriodo(request: PeriodoEmpresaRequest): Observable<PeriodoEmpresaResponse> {
    return this.http.post<PeriodoEmpresaResponse>(`${this.API_URL}/crear`, request);
  }
}
