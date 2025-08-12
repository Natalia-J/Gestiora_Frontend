import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface CatalogoItem {
  id: string;
  name: string;
}

export interface CatalogosResponse {
  imssEmpleado: CatalogoItem[];
  sbcEmpleado: CatalogoItem[];
  entidadFederativa: CatalogoItem[];
  estadoCivil: CatalogoItem[];
  genero: CatalogoItem[];
  metodoPagoEmpleado: CatalogoItem[];
  regimenEmpleado: CatalogoItem[];
  regimenEmpresa: CatalogoItem[];
  sindicatoEmpleado: CatalogoItem[];
  tipoCodigoEmpleado: CatalogoItem[];
  tipoContratoEmpleado: CatalogoItem[];
  tipoPeriodo: CatalogoItem[];
  tipoPrestacionEmpleado: CatalogoItem[];
  zonaSalarioGeneral: CatalogoItem[];
  tipoJornada: CatalogoItem[];
  baseDePago: CatalogoItem[];
  baseCotizacion:CatalogoItem[];
  inconsistencias:CatalogoItem[];
  tipoPeriodoEmpleado: CatalogoItem[];
  diaSemana: CatalogoItem[];

}

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiUrl = 'http://localhost:8080/api/catalog/catalogos';

  constructor(private http: HttpClient, private authService:AuthService) {}

  getCatalogos(): Observable<CatalogosResponse> {
    return this.http.get<CatalogosResponse>(this.apiUrl);
  }


    getInconsistencias(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/catalog/inconsistencias');
  }

      getPeriodos(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/catalog/periodo');// se ocupa este parea los periodos de los tabs
  }
}
