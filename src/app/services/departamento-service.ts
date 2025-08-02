import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DepartamentoItem {
  id: number;
  codigo: string;
  nombreDepartamento: string;
}

export interface DepartamentoRequest {
  codigo: string;
  nombreDepartamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = 'http://localhost:8080/api/departamentos';

  private departamentoSeleccionadoSubject = new BehaviorSubject<DepartamentoItem | null>(null);
  departamentoSeleccionado$ = this.departamentoSeleccionadoSubject.asObservable();
 
  constructor(private http: HttpClient) {}
 
  seleccionarDepartamento(depto: DepartamentoItem) {
   this.departamentoSeleccionadoSubject.next(depto);
  }
 
  limpiarSeleccion() {
   this.departamentoSeleccionadoSubject.next(null);
  }

  crearDepartamento(departamento: DepartamentoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, departamento);
  }

  listar(): Observable<DepartamentoItem[]> {
    return this.http.get<DepartamentoItem[]>(`${this.apiUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  eliminarConEmpleados(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarConEmpleados/${id}`);
  }

  tieneEmpleados(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/tieneEmpleados/${id}`);
  }
}
