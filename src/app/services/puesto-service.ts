import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PuestoRequest {
  nombre: string;
  descripcion: string;
}

export interface Puesto {
  puestoId: number;
  nombrePuesto: string;
}


@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  private apiUrl = 'http://localhost:8080/api/puestos';

  constructor(private http: HttpClient, ) {}

  crearPuesto(puesto: PuestoRequest) {
    return this.http.post(`${this.apiUrl}/crear`, puesto);
  }

obtenerTodos(): Observable<Puesto[]> {
  return this.http.get<Puesto[]>(`${this.apiUrl}/obtener-todos`);
}

}
