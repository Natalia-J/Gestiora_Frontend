import { Component, inject, Input } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PrenominaService } from '../../../services/prenomina-service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';

interface NominaServices {
  obtenerPdfVistaPrevia(employeeIds: number[]): Observable<Blob>;
  descargarPdfOMultiples(employeeIds: number[]): Observable<Blob>;
}

@Component({
  selector: 'app-nomina',
  imports: [DatePipe, CommonModule],
  templateUrl: './nomina.html',
  styleUrl: './nomina.css'
})
export class Nomina {
 @Input() idEmployee!: number;
  @Input() nombreEmpleado?: string;

  // Servicios
  private nominaService = inject(PrenominaService);
  private toastr = inject(ToastrService);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();

  // Estados del componente
  pdfUrl: SafeResourceUrl | null = null;
  isLoading = false;
  isDownloading = false;
  hasError = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.idEmployee) {
      this.cargarVistaPrevia();
    } else {
      this.mostrarError('ID de empleado no proporcionado');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.limpiarUrl();
  }

  cargarVistaPrevia(): void {
    this.isLoading = true;
    this.hasError = false;
    this.limpiarUrl();

    this.nominaService.obtenerPdfVistaPrevia([this.idEmployee])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.procesarPdfBlob(blob);
          this.isLoading = false;
        },
        error: (error) => {
          this.manejarError('Error al cargar la vista previa', error);
          this.isLoading = false;
        }
      });
  }

  descargarPdf(): void {
    if (this.isDownloading) return;

    this.isDownloading = true;
    
    this.nominaService.descargarPdfOMultiples([this.idEmployee])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.procesarDescarga(blob);
          this.isDownloading = false;
        },
        error: (error) => {
          this.manejarError('Error al descargar la nómina', error);
          this.isDownloading = false;
        }
      });
  }

  /**
   * Reintenta cargar la vista previa
   */
  reintentarCarga(): void {
    this.cargarVistaPrevia();
  }

  /**
   * Procesa el blob del PDF para la vista previa
   */
  private procesarPdfBlob(blob: Blob): void {
    try {
      if (blob.size === 0) {
        throw new Error('El archivo PDF está vacío');
      }

      const url = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toastr.success('Nómina cargada correctamente', 'Éxito');
    } catch (error) {
      this.manejarError('Error al procesar el PDF', error);
    }
  }

  /**
   * Procesa la descarga del PDF
   */
  private procesarDescarga(blob: Blob): void {
    try {
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const nombreArchivo = this.generarNombreArchivo();
      
      link.href = url;
      link.download = nombreArchivo;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      this.toastr.success(`Nómina descargada: ${nombreArchivo}`, 'Descarga Completa');
    } catch (error) {
      this.manejarError('Error al procesar la descarga', error);
    }
  }

  /**
   * Genera el nombre del archivo para descarga
   */
  private generarNombreArchivo(): string {
    const fecha = new Date().toISOString().split('T')[0];
    const empleado = this.nombreEmpleado ? 
      this.nombreEmpleado.replace(/\s+/g, '_') : 
      `Empleado_${this.idEmployee}`;
    return `Nomina_${empleado}_${fecha}.pdf`;
  }

  /**
   * Maneja errores del servicio
   */
  private manejarError(mensaje: string, error: any): void {
    console.error(mensaje, error);
    
    let errorDetail = '';
    if (error?.error instanceof Blob) {
      // Error en formato blob, intentar leer como texto
      error.error.text().then((text: string) => {
        try {
          const errorObj = JSON.parse(text);
          errorDetail = errorObj.message || text;
        } catch {
          errorDetail = text;
        }
        this.mostrarError(`${mensaje}: ${errorDetail}`);
      });
    } else {
      errorDetail = error?.message || error?.error?.message || 'Error desconocido';
      this.mostrarError(`${mensaje}: ${errorDetail}`);
    }
  }

  /**
   * Muestra error en la interfaz
   */
  private mostrarError(mensaje: string): void {
    this.hasError = true;
    this.errorMessage = mensaje;
    this.toastr.error(mensaje, 'Error');
  }

  /**
   * Limpia la URL del blob para evitar memory leaks
   */
  private limpiarUrl(): void {
    if (this.pdfUrl) {
      const url = (this.pdfUrl as any).changingThisBreaksApplicationSecurity;
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
      this.pdfUrl = null;
    }
  }

  /**
   * Obtiene el estado de carga para la UI
   */
  get estadoCarga(): string {
    if (this.isLoading) return 'Cargando vista previa...';
    if (this.hasError) return 'Error al cargar';
    if (this.pdfUrl) return 'Vista previa cargada';
    return 'Sin contenido';
  }

  /**
   * Verifica si se puede descargar
   */
  get puedeDescargar(): boolean {
    return !this.isDownloading && !this.isLoading && !!this.idEmployee;
  }
}
