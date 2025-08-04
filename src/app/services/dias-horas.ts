import { Injectable } from '@angular/core';
import { Departamento } from '../schemas/departamento.schema';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusquedaDatosRequest } from '../schemas/busqueda-datos-request.schema';
import { GuardarRegistroRequest } from '../schemas/guardar-registro.schema';
import { BusquedaDatosResponse } from '../schemas/busqueda-datos-response.schema';

@Injectable({
  providedIn: 'root'
})
export class DiasHorasService {

  private readonly API_URL = 'http://localhost:8080/api/departamentos';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de departamentos disponibles.
   * @returns Observable con un array de Departamento
   */
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.API_URL}/listar`);
  }

  buscarDatosEmpleado(datosRequest: BusquedaDatosRequest): Observable<BusquedaDatosResponse> {
    return this.http.post<BusquedaDatosResponse>(`http://localhost:8080/api/dias-horas/buscar`, datosRequest);
  }

  // http://localhost:8080/api/dias-horas/guardar

guardarRegistro(datos: GuardarRegistroRequest): Observable<string> {
  return this.http.post('http://localhost:8080/api/dias-horas/guardar', datos, {
    responseType: 'text'
  });
}


}
