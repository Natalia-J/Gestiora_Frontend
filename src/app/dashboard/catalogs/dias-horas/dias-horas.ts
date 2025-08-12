// dias-horas.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DiasHorasService} from '../../../services/dias-horas';
import { PeriodosService } from '../../../services/periodos';
import { PeriodoEmpleadoResponseBin } from '../../../schemas/periodoEmpleado.schema';
import { Departamento, Empleado } from '../../../schemas/departamento.schema';
import { CatalogoItem, CatalogosService } from '../../../services/catalogosService';
import { GuardarRegistroRequest } from '../../../schemas/guardar-registro.schema';
import { BusquedaDatosRequest } from '../../../schemas/busqueda-datos-request.schema';
import { ToastService } from '../../../services/toast-service';
import { ToastrService } from 'ngx-toastr';

interface RegistroHoras {
  id?: string;
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  horasTrabajadas: number;
  esDiaDescanso: boolean;
  inconsistencia?: string;
  comentario?: string;
  hasChanges?: boolean;
}

interface TurnoInfo {
  turno: string;
  diasDescanso: number;
  tipoJornada: string;
  horaEntrada: string;
  horaSalida: string;
}

@Component({
  selector: 'app-dias-horas',
  imports: [CommonModule, FormsModule],
  templateUrl: './dias-horas.html',
  styleUrl: './dias-horas.css'
})
export class DiasHoras implements OnInit, OnDestroy {

  periodosEmpleado: PeriodoEmpleadoResponseBin[] = [];
  departamentos: Departamento[] = [];
  empleados: Empleado[] = [];
  inconsistencias: CatalogoItem[] = [];
  registros: RegistroHoras[] = [];

  codigoBusqueda: string = '';
  departamentoSelected: string = '';
  empleadoSelected: string = '';
  periodoSelected: string = '';

  mostrarTabla: boolean = false;
  turnoInfo: TurnoInfo | null = null;
  loading: boolean = false;
  saving: boolean = false;

  horasDiasService = inject(DiasHorasService);
  periodoService = inject(PeriodosService);
  catalogsService = inject(CatalogosService);
  toastService = inject(ToastrService)

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.getDepartamentos();
    this.getPeriodos();
    this.getInconsistencias();
  }

  getDepartamentos(): void {
    this.horasDiasService.getDepartamentos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departamentos) => {
          this.departamentos = departamentos;
        },
        error: (error) => {
          alert(JSON.stringify(error))
          console.error('Error obteniendo departamentos:', error);
        }
      });
  }

  getPeriodos(): void {
    this.periodoService.getPeriodosEmpresa()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (periodos) => {
          this.periodosEmpleado = periodos;
        },
        error: (error) => {
          console.error('Error obteniendo períodos:', error);
        }
      });
  }

  getInconsistencias(): void {
    this.catalogsService.getInconsistencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (catalogos) => {
          this.inconsistencias = catalogos || [];
        },
        error: (error) => {
          console.error('Error obteniendo inconsistencias:', error);
        }
      });
  }

  onDepartamentoChange(): void {
    this.empleadoSelected = '';
    this.mostrarTabla = false;
    this.turnoInfo = null;
    this.registros = [];

    if (this.departamentoSelected) {
      this.loadEmpleadosFromDepartamento();
    } else {
      this.empleados = [];
    }
  }

  private loadEmpleadosFromDepartamento(): void {
    const departamentoSeleccionado = this.departamentos.find(
      dept => dept.id.toString() === this.departamentoSelected
    );
    
    if (departamentoSeleccionado) {
      this.empleados = departamentoSeleccionado.empleados || [];
    }
  }

  onEmpleadoChange(): void {
    this.mostrarTabla = false;
    this.turnoInfo = null;
    this.registros = [];
    this.checkAndLoadData();
  }

  onPeriodoChange(): void {
    this.checkAndLoadData();
  }

  onCodigoChange(): void {
    if (this.codigoBusqueda.length > 0) {
      this.checkAndLoadData();
    }
  }

  private checkAndLoadData(): void {
    const hasRequiredFields = !!(
      (this.departamentoSelected && this.empleadoSelected && this.periodoSelected) ||
      (this.periodoSelected && this.codigoBusqueda)
    );

    if (hasRequiredFields) {
      this.showDataInTable();
    }
  }

  showDataInTable(): void {
    const hasBasicData = !!(this.departamentoSelected && this.empleadoSelected && this.periodoSelected);
    const hasCodeData = !!(this.periodoSelected && this.codigoBusqueda);

    if (!hasBasicData && !hasCodeData) {
      return;
    }

    this.loading = true;
    
    const searchParams: BusquedaDatosRequest = {
      codigoEmpleado: this.codigoBusqueda || '',
      departamentoId: this.departamentoSelected ? parseInt(this.departamentoSelected) : 0,
      empleadoId: this.empleadoSelected ? parseInt(this.empleadoSelected) : 0,
      periodoId: parseInt(this.periodoSelected)
    };

     this.horasDiasService.buscarDatosEmpleado(searchParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // La respuesta es un objeto con un array de datos
          const data = response.registros || response;
          
          if (Array.isArray(data)) {
            this.processTableData(data);
          } else {
            console.warn('La respuesta no contiene un array de datos:', response);
            this.registros = [];
          }
          
          // Cargar información del turno si hay empleado seleccionado
          if (this.empleadoSelected) {
            this.loadTurnoInfo();
          }
          
          this.mostrarTabla = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando datos:', error);
          this.mostrarTabla = false;
          this.loading = false;
        }
      });

  }


private processTableData(data: any[]): void {
  this.registros = data.map((item: any) => ({
    id: item.id,
    fecha: new Date(item.fecha),
    horaEntrada: this.formatTimeFromServer(item.horaEntrada) || '',
    horaSalida: this.formatTimeFromServer(item.horaSalida) || '',
    horasTrabajadas: item.horasTrabajadas || 0,
    esDiaDescanso: item.esDiaDescanso || false,
    inconsistencia: item.inconsistencia ? String(item.inconsistencia) : '',
    comentario: item.comentario || '',
    hasChanges: false
  }));
}

private formatTimeFromServer(timeString: string): string {
  if (!timeString) return '';
  
  if (timeString.length === 8) {
    return timeString.substring(0, 5);
  }
  
  return timeString;
}
private formatTimeForServer(timeString: string): string {
  if (!timeString) return '';
  
  if (timeString.length === 5) {
    return `${timeString}:00`;
  }
  
  return timeString;
}


  private loadTurnoInfo(): void {
    const empleado = this.empleados.find(
      emp => emp.id.toString() === this.empleadoSelected
    );

    if (empleado && empleado.turno) {
      this.turnoInfo = {
        turno: empleado.turno.nombre,
        diasDescanso: empleado.turno.diasDescanso?.length || 0,
        tipoJornada: empleado.turno.tipoJornada?.tipoJornada || 'No especificada',
        horaEntrada: empleado.turno.horaEntrada,
        horaSalida: empleado.turno.horaSalida,
      };
    }
  }

  onFieldChange(registro: RegistroHoras): void {
    
    registro.hasChanges = true;
    if (registro.horaEntrada && registro.horaSalida) {
      registro.horasTrabajadas = this.calculateWorkedHours(
        registro.horaEntrada, 
        registro.horaSalida
      );
    }
  }

  private calculateWorkedHours(horaEntrada: string, horaSalida: string): number {
    if (!horaEntrada || !horaSalida) return 0;

    const [horaE, minE] = horaEntrada.split(':').map(Number);
    const [horaS, minS] = horaSalida.split(':').map(Number);
    
    const entrada = horaE * 60 + minE;
    let salida = horaS * 60 + minS;
    
    if (salida < entrada) {
      salida += 24 * 60;
    }
    
    const minutosTrabajados = salida - entrada;
    return Math.round((minutosTrabajados / 60) * 100) / 100;
  }

  update(registro: RegistroHoras): void {

    if (!registro.hasChanges || this.saving) return;

    this.saving = true;

    const fechaFormatted = registro.fecha.toISOString().split('T')[0];
// 
    const dataToSave: GuardarRegistroRequest = {
      horaEntrada: this.formatTimeForServer(registro.horaEntrada),
      horaSalida: this.formatTimeForServer(registro.horaSalida),
      fecha: fechaFormatted,
      periodoId: parseInt(this.periodoSelected),
      empleadoId: parseInt(this.empleadoSelected),
      inconsistenciaId: registro.inconsistencia && registro.inconsistencia !== '' ? parseInt(registro.inconsistencia) : 0,
    };

    this.horasDiasService.guardarRegistro(dataToSave)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success("Registro actualizado con éxito","Chido")

          this.showDataInTable()
          registro.hasChanges = false;
          this.saving = false;

          this.showNotification('Registro guardado exitosamente', 'success');
        },
        error: (error) => {
          this.toastService.error(error.error,"asd")
          this.saving = false;
          console.error('Error guardando registro:', error);
          this.showNotification('Error al guardar el registro', 'error');
        }
      });
  }


onHoraEntradaChange(registro: RegistroHoras, newValue: string): void {
  registro.horaEntrada = this.ensureFullTimeFormat(newValue);
  this.onFieldChange(registro);
}

onHoraSalidaChange(registro: RegistroHoras, event: Event): void {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;
  
  
registro.horaSalida = this.ensureFullTimeFormat(newValue);
  this.onFieldChange(registro);
}


private ensureFullTimeFormat(timeString: string): string {
  if (!timeString) return '';
  
  if (timeString.length === 5) {
    return `${timeString}:00`;
  }
  
  return timeString;
}


  private showNotification(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      console.log('✅', message);
    } else {
      console.error('❌', message);
    }
  }

  saveAllChanges(): void {
    const changedRegistros = this.registros.filter(r => r.hasChanges);
    if (changedRegistros.length === 0) return;

    changedRegistros.forEach(registro => this.update(registro));
  }

  trackByFn(index: number, item: RegistroHoras): any {
    return item.id || index;
  }

  resetForm(): void {
    this.departamentoSelected = '';
    this.empleadoSelected = '';
    this.periodoSelected = '';
    this.codigoBusqueda = '';
    this.empleados = [];
    this.registros = [];
    this.mostrarTabla = false;
    this.turnoInfo = null;
  }

  get hasFiltersApplied(): boolean {
    return !!(this.departamentoSelected || this.empleadoSelected || this.periodoSelected || this.codigoBusqueda);
  }

  get canLoadData(): boolean {
    return !!(
      (this.departamentoSelected && this.empleadoSelected && this.periodoSelected) || 
      (this.periodoSelected && this.codigoBusqueda)
    );
  }

  get selectedEmployeeName(): string {
    if (!this.empleadoSelected) return '';
    const empleado = this.empleados.find(emp => emp.id.toString() === this.empleadoSelected);
    return empleado ? empleado.nombreCompleto : '';
  }

  get selectedDepartmentName(): string {
    if (!this.departamentoSelected) return '';
    const departamento = this.departamentos.find(dept => dept.id.toString() === this.departamentoSelected);
    return departamento ? departamento.nombreDepartamento : '';
  }

  get selectedPeriodName(): string {
    if (!this.periodoSelected) return '';
    const periodo = this.periodosEmpleado.find(per => per.id.toString() === this.periodoSelected);
    return periodo ? periodo.rangoFechas : '';
  }

  getInconsistenciaName(inconsistenciaId: string): string {
    if (!inconsistenciaId) return 'Sin inconsistencias';
    const inconsistencia = this.inconsistencias.find(inc => inc.id === inconsistenciaId);
    return inconsistencia ? inconsistencia.name : 'Sin inconsistencias';
  }

  get canLoadDataValidation(): boolean {
    return !!(
      (this.departamentoSelected && this.empleadoSelected && this.periodoSelected) || 
      (this.periodoSelected && this.codigoBusqueda)
    );
  }

  clearCodeSearch(): void {
    this.codigoBusqueda = '';
    this.mostrarTabla = false;
    this.registros = [];
    this.turnoInfo = null;
  }

  get totalHorasTrabajadas(): number {
    return this.registros.reduce((total, registro) => total + (registro.horasTrabajadas || 0), 0);
  }

  get totalDiasDescanso(): number {
    return this.registros.filter(registro => registro.esDiaDescanso).length;
  }

  get registrosConInconsistencias(): number {
    
    return this.registros.filter(registro => registro.inconsistencia && registro.inconsistencia !== '').length;
  }

  get hasUnsavedChanges(): boolean {
    return this.registros.some(registro => registro.hasChanges);
  }

  get pendingChangesCount(): number {
    return this.registros.filter(registro => registro.hasChanges).length;
  }

 isInconsistenciaSelected(inconsistenciaId: string, registroInconsistencia: string): boolean {
  return String(inconsistenciaId) === String(registroInconsistencia);
}
}