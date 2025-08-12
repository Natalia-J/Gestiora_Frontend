import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeriodoRequest, RegistroEmpleado } from '../schemas/reporte-empleado.schema';
import { Observable } from 'rxjs';
import { PrenominaRequest, RegistroPrenomina } from '../schemas/prenomina-Empleados.schemas';

export interface NominaRequest {
  employeeIds: number[];
}


@Injectable({
  providedIn: 'root'
})
export class PrenominaService {
    private readonly API_URL = 'http://localhost:8080/api/prenomina';

  constructor(private http: HttpClient) {}

  
  guardarPrenomina(empleadoId: number, tipoPeriodoId: number, prenominaRequest: PrenominaRequest): Observable<void> {
    const url = `${this.API_URL}/guardar/${empleadoId}?tipoPeriodoId=${tipoPeriodoId}`;
    return this.http.post<void>(url, prenominaRequest);// este sirve para guardar los datos en la base de datos
  }// este es el service, este es un ejemplo de como hacepta la url: http://localhost:8080/api/empleado/prenomina/guardar/2?tipoPeriodoId=1

  getPrenominaPorTipoPeriodo(tipoPeriodoId: number): Observable<RegistroPrenomina[]> {
    return this.http.get<RegistroPrenomina[]>(`${this.API_URL}/por-tipo-periodo/${tipoPeriodoId}`);
  } // este esd para traer el tipo de prenomina por tipo, ejemplo de la ruta: http://localhost:8080/api/prenomina/por-tipo-periodo/1

  getPrenominaPorEmpleado(empleadoId: number): Observable<RegistroPrenomina> {
    return this.http.get<RegistroPrenomina>(`${this.API_URL}/empleado/${empleadoId}`);
  }

    obtenerPdfVistaPrevia(employeeIds: number[]): Observable<Blob> {
    const url = `${this.API_URL}/export/pdf/vista`;
    const body: NominaRequest = { employeeIds };

    return this.http.post(url, body, {
      responseType: 'blob', 
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  descargarPdfOMultiples(employeeIds: number[]): Observable<Blob> {
    const url = `${this.API_URL}/export/pdf`;
    const body: NominaRequest = { employeeIds };

    return this.http.post(url, body, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}