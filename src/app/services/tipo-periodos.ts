import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmpleadoResponse } from '../schemas/tipo-periodo.schemas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPeriodos {
  private readonly API_URL = 'http://localhost:8080/api/empleado';

  constructor(private http: HttpClient) { }

    getEmpleadosPorTipoPeriodo(tipoPeriodo: number): Observable<EmpleadoResponse[]> {
    return this.http.get<EmpleadoResponse[]>(`${this.API_URL}/${tipoPeriodo}`);
  }
}
