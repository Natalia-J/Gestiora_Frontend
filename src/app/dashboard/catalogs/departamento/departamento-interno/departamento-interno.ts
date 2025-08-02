import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoEmpleadoService } from '../../../../services/departamento-empleado-service';
import { DepartamentoItem } from '../../../../services/departamento-service';

export interface EmpleadoSimple {
  id: number;
  codigoEmpleado: string;
  nombreEmpleado: string;
  apellidoPaternoEmpleado: string;
  apellidoMaternoEmpleado: string;
  puesto: {
    nombre: string;
  };
}

export interface DepartamentoConEmpleados {
  id: number;
  codigo: string;
  nombreDepartamento: string;
  empleados: EmpleadoSimple[];
}

@Component({
  selector: 'app-departamento-interno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departamento-interno.html',
  styleUrls: ['./departamento-interno.css']
})
export class DepartamentoInterno implements OnChanges {

  @Input() departamento?: DepartamentoItem;

  departamentoSeleccionado?: DepartamentoConEmpleados;
  empleadosFiltrados: EmpleadoSimple[] = [];
  busqueda: string = '';
  menuEmpleadoAbiertoId: number | null = null;

  constructor(private departamentoService: DepartamentoEmpleadoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departamento'] && this.departamento) {
      console.log('Departamento recibido en ngOnChanges:', this.departamento);

      this.departamentoService.getDepartamentosConEmpleados().subscribe(data => {
        console.log('Lista completa desde servicio:', data);

        const encontrado = data.find(d => d.id === this.departamento!.id);

        if (encontrado) {
          console.log('Departamento encontrado:', encontrado);
          this.seleccionarDepartamento(encontrado);
        } else {
          console.warn('Departamento no encontrado en la lista');
        }
      });
    }
  }

  seleccionarDepartamento(departamento: DepartamentoConEmpleados): void {
    this.departamentoSeleccionado = departamento;
    this.empleadosFiltrados = departamento.empleados.sort((a, b) =>
      a.nombreEmpleado.localeCompare(b.nombreEmpleado)
    );
    this.busqueda = '';
  }

  filtrarEmpleados(): void {
    const criterio = this.busqueda.toLowerCase();
    if (this.departamentoSeleccionado) {
      this.empleadosFiltrados = this.departamentoSeleccionado.empleados.filter(emp =>
        `${emp.nombreEmpleado} ${emp.apellidoPaternoEmpleado} ${emp.apellidoMaternoEmpleado}`.toLowerCase().includes(criterio)
      ); 
    }
  }

  toggleMenu(empleadoId: number): void {
    this.menuEmpleadoAbiertoId = this.menuEmpleadoAbiertoId === empleadoId ? null : empleadoId;
  }

  editarEmpleado(empleado: EmpleadoSimple): void {
    console.log('Editar:', empleado);
  }

  cambiarDepartamento(empleado: EmpleadoSimple): void {
    console.log('Cambiar de departamento:', empleado);
  }

  eliminarEmpleado(empleado: EmpleadoSimple): void {
    console.log('Eliminar:', empleado);
  }
  
}
