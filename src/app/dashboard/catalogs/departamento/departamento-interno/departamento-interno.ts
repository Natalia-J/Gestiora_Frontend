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
    const empleadosOrdenados = departamento.empleados.sort((a, b) =>
      a.nombreEmpleado.localeCompare(b.nombreEmpleado)
    );
    this.empleadosFiltrados = empleadosOrdenados;
    this.agruparEmpleadosPorLetra(empleadosOrdenados);

    this.busqueda = '';
    console.log('empleados:', this.empleadosFiltrados)
  }
  

  filtrarEmpleados(): void {
    if (!this.departamentoSeleccionado?.empleados) {
      return;
    }

    const terminoBusqueda = this.busqueda.toLowerCase().trim();
    
    if (!terminoBusqueda) {
      this.empleadosFiltrados = [...this.departamentoSeleccionado.empleados];
    } else {
      this.empleadosFiltrados = this.departamentoSeleccionado.empleados.filter(empleado => {
        const nombreCompleto = `${empleado.nombreEmpleado} ${empleado.apellidoPaternoEmpleado} ${empleado.apellidoMaternoEmpleado}`.toLowerCase();
        const puesto = empleado.puesto?.nombre?.toLowerCase() || '';
        
        return nombreCompleto.includes(terminoBusqueda) || puesto.includes(terminoBusqueda);
      });
    }
    
    this.agruparEmpleados();
    
    this.menuEmpleadoAbiertoId = null;
  }

    private agruparEmpleados(): void {
    this.empleadosAgrupados = {};
    
    this.empleadosFiltrados.forEach(empleado => {
      const primeraLetra = empleado.nombreEmpleado.charAt(0).toUpperCase();
      
      if (!this.empleadosAgrupados[primeraLetra]) {
        this.empleadosAgrupados[primeraLetra] = [];
      }
      
      this.empleadosAgrupados[primeraLetra].push(empleado);
    });

    Object.keys(this.empleadosAgrupados).forEach(letra => {
      this.empleadosAgrupados[letra].sort((a, b) => 
        a.nombreEmpleado.localeCompare(b.nombreEmpleado)
      );
    });
  }

  empleadosAgrupados: { [letra: string]: any[] } = {};

  agruparEmpleadosPorLetra(empleados: any[]) {
    this.empleadosAgrupados = {};

    empleados.forEach(empleado => {
      const letra = empleado.nombreEmpleado.charAt(0).toUpperCase();
      if (!this.empleadosAgrupados[letra]) {
        this.empleadosAgrupados[letra] = [];
      }
      this.empleadosAgrupados[letra].push(empleado);
    });
  }

  sortByKey = (a: { key: string }, b: { key: string }) => a.key.localeCompare(b.key);



  toggleMenu(empleadoId: number): void {
    this.menuEmpleadoAbiertoId = this.menuEmpleadoAbiertoId === empleadoId ? null : empleadoId;
  }

  abrirModalAgregarEmpleado(){}

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
