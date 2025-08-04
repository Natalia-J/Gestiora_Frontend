import { Component, inject } from '@angular/core';
import { CatalogosService } from '../../../services/catalogosService';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PrenominaService } from '../../../services/prenomina-service';
import { PrenominaRequest, RegistroPrenomina } from '../../../schemas/prenomina-Empleados.schemas';

@Component({
  selector: 'app-prenomina',
  imports: [CommonModule],
  templateUrl: './prenomina.html',
  styleUrl: './prenomina.css'
})
export class Prenomina {
/* periodos: any[] = [];
  periodoSelected: number | null = null;
  registroEmpleado: RegistroPrenomina[] = [];

  catalogosService = inject(CatalogosService);
  prenominaService = inject(PrenominaService);
  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.catalogosService.getPeriodos().subscribe({
      next: (response) => {
        this.periodos = response;
        if (this.periodos.length > 0) {
          this.selectPeriodo(this.periodos[0].id);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los períodos');
      }
    });
  }

  selectPeriodo(periodoId: number): void {
    this.periodoSelected = periodoId;
    this.cargarEmpleadosPorPeriodo(periodoId);
  }

  cargarEmpleadosPorPeriodo(tipoPeriodoId: number): void {
    this.prenominaService.getEmpleadosPorTipoPeriodo(tipoPeriodoId).subscribe({
      next: (response) => {
        this.registroEmpleado = response;
      },
      error: () => {
        this.toastService.error('Error al cargar empleados para el período');
      }
    });
  }

  guardarCambios(empleado: RegistroPrenomina): void {
    if (!this.periodoSelected) {
      this.toastService.warning('Debe seleccionar un periodo');
      return;
    }
 
    const prenominaRequest: PrenominaRequest = {
      bono: empleado.Bonos,
      comisiones: empleado.comisiones,
      gratificaciones: empleado.gratificaciones,
      aguinaldoProporcional: empleado.aguinaldoProporcional,
      primaVacacional: empleado.primaVacacional,
      imss: empleado.imss,
      infonavit: empleado.infonavit,
      otrasDeducciones: empleado.otrasDeducciones
    };

    this.prenominaService.guardarPrenomina(empleado.codigoEmpleado as unknown as number, this.periodoSelected, prenominaRequest).subscribe({
      next: () => {
        this.toastService.success(`Datos guardados para ${empleado.nombreEmpleado}`);
      },
      error: () => {
        this.toastService.error(`Error al guardar datos de ${empleado.nombreEmpleado}`);
      }
    });
  }

  trackByEmpleadoId(index: number, item: RegistroPrenomina): string {
    return item.codigoEmpleado;
  }*/

}
