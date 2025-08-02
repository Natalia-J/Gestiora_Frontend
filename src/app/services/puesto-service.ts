import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface PuestoRequest {
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  private apiUrl = '/api/puestos';

  constructor(private http: HttpClient, ) {}

  crearPuesto(puesto: PuestoRequest) {
    return this.http.post(`${this.apiUrl}/crear`, puesto);
  }

  obtenerTodos() {
    return this.http.get(`${this.apiUrl}/obtener-todos`);
  }
}
