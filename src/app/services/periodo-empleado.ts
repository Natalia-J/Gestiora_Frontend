import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoEmpleadoResponseBin } from '../schemas/periodoEmpleado.schema';

@Injectable({
  providedIn: 'root'
})
export class PeriodoEmpleado {
     private readonly API_URL = 'http://localhost:8080/api/periodo-pago';

constructor(private http: HttpClient) {}


  getPeriodosEmpresa(tipoPeriodo : any): Observable<PeriodoEmpleadoResponseBin[]> {
    return this.http.get<PeriodoEmpleadoResponseBin[]>(`${this.API_URL}/empleado/${tipoPeriodo}`);
  }

}
