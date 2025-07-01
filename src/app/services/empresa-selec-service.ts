import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Empresa {
  id: number;
  nombre: string;
  rfc: string;
  zonaSalario?: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaSelecService {
  private apiUrl = 'http://localhost:8080/api/empresa';

  constructor(private http: HttpClient) {}

  obtenerEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/obtener`);
  }
}
