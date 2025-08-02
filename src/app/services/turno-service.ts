import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TipoJornada {
  id: number;
  tipoJornada: string;
  horaInicio: string;     
  horaFin: string;
  duracionMaxima: number;
}

export interface Turno {
  id?: number;
  nombre: string;
  horaEntrada: string;
  horaSalida: string;
  horasTurno: number;
  tipoJornada:TipoJornada;
}

export interface TurnoRequest {
  nombreTurno: string;
  horaEntrada: string; 
  horaSalida: string;  
  tipoJornada: number;
}

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:8080/api/turno';

  constructor(private http: HttpClient) {}

  obtenerTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/obtener-todos`);
  }

  crearTurno(request: TurnoRequest): Observable<Turno> {
    return this.http.post<Turno>(`${this.apiUrl}/crear`, request);
  }

  eliminarTurnoPorNombre(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nombre/${nombre}`);
  }
}
