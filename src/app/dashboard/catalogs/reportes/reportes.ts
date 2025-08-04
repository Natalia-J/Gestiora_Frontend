import { Component, inject, OnInit } from '@angular/core';
import { CatalogosService } from '../../../services/catalogosService';
import { CommonModule } from '@angular/common';
import { PeriodoEmpleado } from '../../../services/periodo-empleado';
import { ReporteService } from '../../../services/reporte-service';
import { PeriodoRequest, RegistroEmpleado } from '../../../schemas/reporte-empleado.schema';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {
  periodos: any[] = [];
  rangoPeriodos: any[] = [];
  registroEmpleado: RegistroEmpleado[] = [];
  
  // Estados para periodoSelected y periodoRangoSelected
  periodoSelected: number | null = null;
  periodoRangoSelected: number | null = null;
  
  // Servicios inyectados
  catalogsService = inject(CatalogosService);
  periodoService = inject(PeriodoEmpleado);
  reporteService = inject(ReporteService);
  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.getPeriodosEmpleado();
  }

  getPeriodosEmpleado(): void {
    this.catalogsService.getPeriodos().subscribe({
      next: (response) => {
        this.periodos = response;
        // Seleccionar el primer tab por defecto
        if (this.periodos.length > 0) {
          this.selectTab(this.periodos[0].id);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los períodos');
      }
    });
  }

  selectTab(periodoId: number): void {
    this.periodoSelected = periodoId;
    this.periodoRangoSelected = null;
    this.registroEmpleado = []; // Limpiar tabla
    this.getPeriodosEmpleadoRango();
  }

  getPeriodosEmpleadoRango(): void {
    if (!this.periodoSelected) return;
    
    this.periodoService.getPeriodosEmpresa(this.periodoSelected).subscribe({
      next: (response) => {
        this.rangoPeriodos = response;
      },
      error: () => {
        this.toastService.error('Error al cargar el rango de períodos');
      }
    });
  }

  onDropdownChange(event: Event): void { // me parece qu este tampoco
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value, 10);
    
    if (!isNaN(value)) {
      this.periodoRangoSelected = value;
      this.getDataTable();
    }
  }

  getDataTable(): void {// me parece que este tambien se va 
    if (!this.periodoSelected || !this.periodoRangoSelected) {
      this.toastService.warning('Debe seleccionar un período válido');
      return;
    }

    const periodoRequest: PeriodoRequest = {
      tipoPeriodoId: this.periodoSelected,
      periodoId: this.periodoRangoSelected
    };


    this.reporteService.getPeriodosEmpresaTable(periodoRequest).subscribe({
      next: (response) => {
        this.registroEmpleado = response;
        if (response.length === 0) {
          this.toastService.info('No se encontraron registros');
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los datos del reporte');
      }
    });
  }

  // Métodos de tracking para optimización
  trackByPeriodoId = (index: number, item: any): number => {
    return item.id;
  }

  trackByRangoPeriodoId = (index: number, item: any): number => {
    return item.id;
  }

  trackByEmpleadoId = (index: number, item: RegistroEmpleado): string | number => {
    return item.codigoEmpleado || index;
  }
}