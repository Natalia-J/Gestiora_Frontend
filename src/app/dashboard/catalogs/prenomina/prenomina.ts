import { Component, inject } from '@angular/core';
import { PeriodoRequest, RegistroEmpleado } from '../../../schemas/reporte-empleado.schema';
import { CatalogosService } from '../../../services/catalogosService';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PrenominaService } from '../../../services/prenomina-service';
import { TipoPeriodos } from '../../../services/tipo-periodos';
import { PrenominaRequest, RegistroPrenomina } from '../../../schemas/prenomina-Empleados.schemas';

@Component({
  selector: 'app-prenomina',
  imports: [CommonModule],
  templateUrl: './prenomina.html',
  styleUrl: './prenomina.css'
})
export class Prenomina {
periodos: any[] = [];
  registroEmpleado: RegistroPrenomina[] = [];
  periodoSelected: number | null = null;
  isLoading = false;
  isGeneratingPayroll = false;
  isSaving: { [key: string]: boolean } = {};

  // Servicios inyectados
  private readonly catalogsService = inject(CatalogosService);
  private readonly prenominaService = inject(PrenominaService);
  private readonly toastService = inject(ToastrService);
  private readonly tipoPeriodosService = inject(TipoPeriodos);

  // Mapeo de nombres de períodos
  readonly periodoNames: { [key: number]: string } = {
    1: 'Semanal',
    2: 'Quincenal',
    3: 'Mensual'
  };

  ngOnInit(): void {
    this.loadPeriodos();
  }

  private loadPeriodos(): void {
    this.isLoading = true;
    this.catalogsService.getPeriodos().subscribe({
      next: (response) => {
        this.periodos = response.map((periodo: any) => ({
          ...periodo,
          name: this.periodoNames[periodo.id] || `Periodo ${periodo.id}`
        }));
        
        if (this.periodos.length > 0) {
          this.selectTab(this.periodos[0].id);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar períodos:', error);
        this.toastService.error('Error al cargar los períodos', 'Error');
        this.isLoading = false;
      }
    });
  }

  selectTab(periodoId: number): void {
    if (this.periodoSelected === periodoId) return;
    
    this.periodoSelected = periodoId;
    this.registroEmpleado = [];
    this.isLoading = true;

    this.prenominaService.getPrenominaPorTipoPeriodo(periodoId).subscribe({
      next: (empleados) => {
        this.registroEmpleado = empleados;
        this.isLoading = false;
        
        if (empleados.length === 0) {
          this.toastService.info('No se encontraron empleados para este período', 'Información');
        }
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.toastService.error('Error al cargar empleados para el período seleccionado', 'Error');
        this.isLoading = false;
      }
    });
  }

  guardarPrenomina(empleado: RegistroPrenomina): void {
    const empleadoKey = empleado.codigoEmpleado;
    
    if (this.isSaving[empleadoKey] || !this.periodoSelected) return;

    this.isSaving[empleadoKey] = true;

    const prenominaRequest: PrenominaRequest = {
      bono: empleado.Bonos || 0,
      comisiones: empleado.comisiones || 0,
      gratificaciones: empleado.gratificaciones || 0,
      aguinaldoProporcional: empleado.aguinaldoProporcional || 0,
      primaVacacional: empleado.primaVacacional || 0,
      imss: empleado.imss || 0,
      infonavit: empleado.infonavit || 0,
      otrasDeducciones: empleado.otrasDeducciones || 0
    };

    // Necesitamos el ID numérico del empleado para la API
    const empleadoId = this.extractEmpleadoId(empleado.codigoEmpleado);
    
    this.prenominaService.guardarPrenomina(empleadoId, this.periodoSelected, prenominaRequest).subscribe({
      next: () => {
        this.toastService.success(
          `Prenómina guardada correctamente para ${empleado.nombreEmpleado}`, 
          'Éxito'
        );
        this.isSaving[empleadoKey] = false;
        
        // Recargar datos para mostrar los valores actualizados
        this.selectTab(this.periodoSelected!);
      },
      error: (error) => {
        console.error('Error al guardar prenómina:', error);
        this.toastService.error(
          `Error al guardar la prenómina de ${empleado.nombreEmpleado}`, 
          'Error'
        );
        this.isSaving[empleadoKey] = false;
      }
    });
  }

  private extractEmpleadoId(codigoEmpleado: string): number {
    // Asumiendo que el código del empleado contiene o es un ID numérico
    // Ajusta esta lógica según tu formato de código de empleado
    const match = codigoEmpleado.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  calculateTotalNeto(empleado: RegistroPrenomina): number {
    const ingresos = (empleado.sueldoBase || 0) + 
                    (empleado.horasExtras || 0) + 
                    (empleado.Bonos || 0) + 
                    (empleado.comisiones || 0) + 
                    (empleado.gratificaciones || 0) + 
                    (empleado.aguinaldoProporcional || 0) + 
                    (empleado.primaVacacional || 0);

    const deducciones = (empleado.imss || 0) + 
                       (empleado.infonavit || 0) + 
                       (empleado.otrasDeducciones || 0) + 
                       (empleado.isr || 0);

    return ingresos - deducciones;
  }

  trackByEmpleadoId = (index: number, item: RegistroPrenomina): string => {
    return item.codigoEmpleado;
  };

  trackByPeriodoId = (index: number, item: any): number => {
    return item.id;
  };

  isFieldEditable(fieldName: string): boolean {
    const nonEditableFields = ['sueldoBase', 'totalNeto', 'isr', 'nombreEmpleado', 'codigoEmpleado'];
    return !nonEditableFields.includes(fieldName);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value || 0);
  }

  onInputChange(empleado: RegistroPrenomina, field: string, event: any): void {
    const value = parseFloat(event.target.value) || 0;
    (empleado as any)[field] = value;
    
    // Recalcular total neto si es necesario
    empleado.totalNeto = this.calculateTotalNeto(empleado);
  }

  getTotalNomina(): number {
    return this.registroEmpleado.reduce((total, empleado) => {
      return total + this.calculateTotalNeto(empleado);
    }, 0);
  }

  generarNomina(): void {
    if (this.isGeneratingPayroll || !this.periodoSelected) return;

    this.isGeneratingPayroll = true;

    // Simular llamada a API para generar nómina
    // Aquí deberías llamar a tu servicio real
    setTimeout(() => {
      this.toastService.success(
        `Nómina generada exitosamente para el período ${this.periodoNames[this.periodoSelected!]}`, 
        'Éxito'
      );
      this.isGeneratingPayroll = false;
      
      // Opcional: Redirigir a la vista de nóminas generadas
      // this.router.navigate(['/nominas']);
    }, 2000);

    // Ejemplo de implementación real:
    /*
    this.nominaService.generarNomina(this.periodoSelected, this.registroEmpleado).subscribe({
      next: (response) => {
        this.toastService.success('Nómina generada exitosamente', 'Éxito');
        this.isGeneratingPayroll = false;
        // Opcional: navegar a la vista de nóminas
      },
      error: (error) => {
        console.error('Error al generar nómina:', error);
        this.toastService.error('Error al generar la nómina', 'Error');
        this.isGeneratingPayroll = false;
      }
    });
    */
  }

}
