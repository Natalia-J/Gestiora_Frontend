import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, throwError } from 'rxjs';
import { EmpleadoRequest, moverEmpleado } from '../schemas/empleado.schemas';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
 private apiUrl = 'http://localhost:8080/api/empleado';
  private loadingSubject = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {}

  crearEmpleado(empleadoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, empleadoData);
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  editarEmpleado(id: number, empleadoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar/${id}`, empleadoData);
  }

  obtenerPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }

    obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener/${id}`);
  }

  moverEmpleadoADepartamento(request: moverEmpleado): Observable<any> {
    return this.http.put<number>(`${this.apiUrl}/mover-departamento`, request, { responseType: 'text' as 'json' });
  }

  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'Ocurrió un error inesperado';
  let userMessage = 'Error al procesar la solicitud';

  console.error('Error en EmpleadoService:', error);

  if (error.error instanceof ErrorEvent) {
    errorMessage = `Error de red: ${error.error.message}`;
    userMessage = 'Error de conexión. Verifique su red.';
  } else {
    switch (error.status) {
      case 400:
        errorMessage = 'Datos inválidos';
        userMessage = error.error?.message || 'Los datos enviados no son válidos';
        break;
      case 401:
        errorMessage = 'No autorizado';
        userMessage = 'No tiene permisos para realizar esta acción';
        break;
      case 403:
        errorMessage = 'Acceso denegado';
        userMessage = 'Acceso denegado';
        break;
      case 404:
        errorMessage = 'Recurso no encontrado';
        userMessage = 'El empleado solicitado no existe';
        break;
      case 409:
        errorMessage = 'Conflicto de datos';
        userMessage = error.error?.message || 'Ya existe un empleado con estos datos';
        break;
      case 422:
        errorMessage = 'Datos no procesables';
        userMessage = error.error?.message || 'Los datos no pudieron ser procesados';
        break;
      case 500:
        errorMessage = 'Error interno del servidor';
        userMessage = 'Error interno del servidor. Intente más tarde.';
        break;
      case 0:
        errorMessage = 'Sin conexión al servidor';
        userMessage = 'No se puede conectar al servidor. Verifique su conexión.';
        break;
      default:
        errorMessage = `Error HTTP ${error.status}: ${error.statusText}`;
        userMessage = error.error?.message || 'Error al procesar la solicitud';
    }
  }

  const customError = {
    message: userMessage,
    originalError: errorMessage,
    status: error.status,
    statusText: error.statusText,
    timestamp: new Date().toISOString()
  };

  return throwError(() => customError);
}


  /**
   * @param loading 
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * @returns Estado actual de carga
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Limpiar estado del 
   */
  clearState(): void {
    this.loadingSubject.next(false);
  }

  /**
   * @param formData
   * @returns
   */
  static formatEmpleadoData(formData: any): EmpleadoRequest {
    return {
      ...formData,
      tipoContrato: Number(formData.tipoContrato),
      tipoPeriodo: Number(formData.tipoPeriodo),
      salarioDiario: Number(formData.salarioDiario),
      baseCotizacion: Number(formData.baseCotizacion),
      departamento: Number(formData.departamento),
      puesto: Number(formData.puesto),
      sindicato: Number(formData.sindicato),
      tipoPrestacion: Number(formData.tipoPrestacion),
      baseDePago: Number(formData.baseDePago),
      metodoPago: Number(formData.metodoPago),
      turnoTrabajo: Number(formData.turnoTrabajo),
      zonaSalario: Number(formData.zonaSalario),
      tipoRegimen: Number(formData.tipoRegimen),
      estadoCivil: Number(formData.estadoCivil),
      genero: Number(formData.genero),
      entidadFederativa: Number(formData.entidadFederativa),
      avisosPendientesImss: Boolean(formData.avisosPendientesImss),
      codigoEmpleado: formData.codigoEmpleado?.trim().toUpperCase(),
      nombre: this.capitalizeWords(formData.nombre?.trim()),
      apellidoPaterno: this.capitalizeWords(formData.apellidoPaterno?.trim()),
      apellidoMaterno: this.capitalizeWords(formData.apellidoMaterno?.trim()),
      correo: formData.correo?.trim().toLowerCase(),
      curp: formData.curp?.trim().toUpperCase(),
      rfc: formData.rfc?.trim().toUpperCase(),
      ciudad: this.capitalizeWords(formData.ciudad?.trim()),
      afore: formData.afore?.trim(),
      numTelefono: formData.numTelefono?.replace(/\D/g, ''),
      numSeguridadSocial: formData.numSeguridadSocial?.replace(/\D/g, ''),
      direccion: {
        calle: this.capitalizeWords(formData.direccion?.calle?.trim()),
        numExterno: formData.direccion?.numExterno?.trim(),
        numInterno: formData.direccion?.numInterno?.trim() || undefined,
        colonia: this.capitalizeWords(formData.direccion?.colonia?.trim()),
        codigoPostal: formData.direccion?.codigoPostal?.replace(/\D/g, ''),
        localidad: this.capitalizeWords(formData.direccion?.localidad?.trim())
      }
    };
  }
  /**
   * @param str String a capitalizar
   * @returns String capitalizado
   */
  private static capitalizeWords(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
