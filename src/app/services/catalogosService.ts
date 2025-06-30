import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

interface CatalogoItem {
  id: string;
  name: string;
}


interface CatalogosResponse {
  tipoCodigoEmpleado: CatalogoItem[];
  zonaSalarioGeneral: CatalogoItem[];
  regimenEmpresa: CatalogoItem[];
}


@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiUrl = 'http://localhost:8080/api/catalog';

  constructor(private http: HttpClient, private authService:AuthService) {}

  getCatalogos(): Observable<CatalogosResponse> {
    return this.http.get<CatalogosResponse>(this.apiUrl);
  }
}
