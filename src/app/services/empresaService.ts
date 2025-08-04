import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/api/empresa';

  constructor(private http: HttpClient) {}

  getCatalogos(): Observable<any> {
    return this.http.get<any>(this.apiUrl+"/crear");
  }


  getEmpresas(){
    return this.http.get<any>(this.apiUrl + '/obtener')
  }

  guardarEmpresa(datos: any): Observable<any> {
    const datosPreparados = this.prepararDatosEmpresa(datos);
    console.log("datos preparados:", datosPreparados);
    console.log("datos;", datos);
    return this.http.post(this.apiUrl+"/crear", datosPreparados)
      .pipe(catchError(this.manejarError));
  }

  private prepararDatosEmpresa(datos: any) {
    return {
      nombre: datos.datosGenerales.nombreEmpresa,
      mascarilla: datos.datosGenerales.mascarillaCodigo,
      vigencia: datos.datosGenerales.ejercicioVigente,
      fecha_inicio: datos.datosGenerales.fechaInicioHistorial,
      factor: datos.datosGenerales.factorNoDeducible,
      telefono1: datos.datosAdicionales.telefono1,
      telefono2: datos.datosAdicionales.telefono2,
      patronalIMSS: datos.registros.registroPatronalIMSS,
      rfc: datos.registros.rfc,
      infonavit: datos.registros.registroInfonavit,
      nombreRepresentante: datos.datosAdicionales.nombreRepresentante,
      apellidoPaRepresentante: datos.datosAdicionales.apellidoPaternoRepresentante,
      apellidoMaRepresentante: datos.datosAdicionales.apellidoMaternoRepresentante,
      zonaSalarioId: Number(datos.datosGenerales.zonaSalarioGeneral),
      tipoCodigoEmpleadoId: Number(datos.datosGenerales.tipoCodigoEmpleado),
      regimenFiscalCompanyId: Number(datos.registros.regimenEmpresa),
      direccionCompany: {
        calle: datos.datosAdicionales.calle,
        numInterno: datos.datosAdicionales.numInterno,
        numExterno: datos.datosAdicionales.numExterno,
        colonia: datos.datosAdicionales.colonia,
        localidad: datos.datosAdicionales.localidad,
        codigoPostal: datos.datosAdicionales.codigoPostal
      }
    };
  }

  private manejarError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del cliente:', error.error.message);
    } else {
      console.error(
        `Error en el servidor: Código ${error.status}, ` +
        `Mensaje: ${error.message}`);
    }
    return throwError(() => new Error('Algo malo pasó; por favor intenta de nuevo más tarde.'));
  }
}
