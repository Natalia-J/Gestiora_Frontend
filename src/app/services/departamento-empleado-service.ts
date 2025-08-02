import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Empleado {
  id: number;
  codigoEmpleado: string;
  nombreEmpleado: string;
  apellidoPaternoEmpleado: string;
  apellidoMaternoEmpleado: string;
  puesto: { id: number; nombre: string };
}

export interface DepartamentoConEmpleados {
  id: number;
  codigo: string;
  nombreDepartamento: string;
  empleados: Empleado[];
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoEmpleadoService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getDepartamentosConEmpleados(): Observable<DepartamentoConEmpleados[]> {
    return this.http.get<DepartamentoConEmpleados[]>(`${this.baseUrl}/departamentos/listar`);
  }

  getTodosLosEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleado/listar`);
  }

  moverEmpleado(empleadoId: number, nuevoDepartamentoId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/empleado/mover-departamento`, {
      empleadoId,
      nuevoDepartamentoId
    });
  }

  getEmpleadoPorCodigo(codigo: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/empleado/${codigo}`);
  }
}
