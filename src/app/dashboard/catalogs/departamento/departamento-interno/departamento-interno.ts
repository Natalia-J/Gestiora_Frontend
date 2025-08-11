import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoEmpleadoService } from '../../../../services/departamento-empleado-service';
import { DepartamentoItem, DepartamentoService } from '../../../../services/departamento-service';
import { Empleado } from '../../empleado/empleado';
import { EmpleadoService } from '../../../../services/empleado-service';
import { ToastrService } from 'ngx-toastr';
import { moverEmpleado } from '../../../../schemas/empleado.schemas';

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
  imports: [CommonModule, FormsModule, Empleado],
  templateUrl: './departamento-interno.html',
  styleUrls: ['./departamento-interno.css']
})
export class DepartamentoInterno implements OnChanges {

  @Input() departamento?: DepartamentoItem;
  modalVisible: boolean = false;
  modalEditarVisible: boolean = false;
  empleadoAEditar?: EmpleadoSimple;

  departamentoSeleccionado?: DepartamentoConEmpleados;
  empleadosFiltrados: EmpleadoSimple[] = [];
  busqueda: string = '';
  menuEmpleadoAbiertoId: number | null = null;

  departamentosDisponibles: DepartamentoItem[] = [];
  departamentoSeleccionadoParaCambio: number | null = null;
  isMoviendoEmpleado: boolean = false;

  modalCambiarDepartamentoVisible: boolean = false;
  empleadoACambiar?: EmpleadoSimple;

  modalEliminarVisible: boolean = false;
  empleadoAEliminar?: EmpleadoSimple;
  isEliminandoEmpleado: boolean = false;

  constructor(
    private departamentoService: DepartamentoEmpleadoService, 
    private departamentoServiceRutas:DepartamentoService,
    private empleadoService: EmpleadoService, 
    private toastr: ToastrService) {}

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

  abrirModalAgregarEmpleado(): void {
    this.empleadoAEditar = undefined;
    this.modalVisible = true;
  }

  editarEmpleado(empleado: EmpleadoSimple): void {
    this.empleadoAEditar = empleado;
    this.modalEditarVisible = true;
    this.menuEmpleadoAbiertoId = null;
  }

  cambiarDepartamento(empleado: EmpleadoSimple): void {
    this.empleadoACambiar = empleado;
    this.cargarDepartamentosDisponibles();
    this.modalCambiarDepartamentoVisible = true;
    this.menuEmpleadoAbiertoId = null;
  }

  private cargarDepartamentosDisponibles(): void {
  this.departamentoServiceRutas.listar().subscribe({
    next: (departamentos) => {
      this.departamentosDisponibles = departamentos.filter(
        dept => dept.id !== this.departamentoSeleccionado?.id
      );
    },
    error: () => {
      this.toastr.error('Error al cargar los departamentos', 'Error');
    }
  });
  }

  realizarCambioDepartamento(): void {
    if (!this.empleadoACambiar || !this.departamentoSeleccionadoParaCambio) {
      this.toastr.warning('Seleccione un departamento', 'Advertencia');
      return;
    }

    this.isMoviendoEmpleado = true;

    const request: moverEmpleado = {
      empleadoId: this.empleadoACambiar.id,
      nuevoDepartamentoId: this.departamentoSeleccionadoParaCambio
    };

    this.empleadoService.moverEmpleadoADepartamento(request).subscribe({
      next: () => {
        this.toastr.success('Empleado movido correctamente', '¡Éxito!');
        this.cerrarModalCambioDepartamento();
        this.recargarDepartamento();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Error al mover el empleado', 'Error');
        this.isMoviendoEmpleado = false;
      }
    });
  }

  cerrarModalCambioDepartamento(): void {
    this.modalCambiarDepartamentoVisible = false;
    this.empleadoACambiar = undefined;
    this.departamentoSeleccionadoParaCambio = null;
    this.isMoviendoEmpleado = false;
  }

  private recargarDepartamento(): void {
    if (this.departamento) {
      this.departamentoService.getDepartamentosConEmpleados().subscribe(data => {
        const encontrado = data.find(d => d.id === this.departamento!.id);
        if (encontrado) {
          this.seleccionarDepartamento(encontrado);
        }
      });
    }
  }

  confirmarEliminacion(): void {
  if (!this.empleadoAEliminar) {
    this.toastr.warning('No se ha seleccionado ningún empleado para eliminar', 'Advertencia');
    return;
  }

  this.isEliminandoEmpleado = true;
  
  const nombreCompleto = `${this.empleadoAEliminar.nombreEmpleado} ${this.empleadoAEliminar.apellidoPaternoEmpleado}`.trim();
  
  this.empleadoService.eliminarEmpleado(this.empleadoAEliminar.id).subscribe({
    next: (response) => {
      this.toastr.success(
        `El empleado ${nombreCompleto} ha sido eliminado correctamente`, 
        '¡Éxito!'
      );
      this.cerrarModalEliminar();
      this.recargarDepartamento();
    },
    error: (err) => {
      console.error('Error al eliminar empleado:', err);
      
      // Manejo más específico de errores
      let errorMessage = 'Error al eliminar el empleado';
      
      if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.status === 404) {
        errorMessage = 'El empleado ya no existe en el sistema';
      } else if (err?.status === 409) {
        errorMessage = 'No se puede eliminar el empleado debido a dependencias existentes';
      } else if (err?.status >= 500) {
        errorMessage = 'Error interno del servidor. Intente más tarde';
      }
      
      this.toastr.error(errorMessage, 'Error');
      this.isEliminandoEmpleado = false;
    },
    complete: () => {
      this.isEliminandoEmpleado = false;
    }
  });
}

cerrarModalEliminar(): void {
  if (this.isEliminandoEmpleado) {
    const confirmacion = confirm(
      'Hay una operación en curso. ¿Está seguro que desea cancelar?'
    );
    if (!confirmacion) {
      return;
    }
  }
  
  this.modalEliminarVisible = false;
  this.empleadoAEliminar = undefined;
  this.isEliminandoEmpleado = false;
}

private validarEliminacion(empleado: EmpleadoSimple): boolean {
  
  if (!empleado.id) {
    this.toastr.error('ID de empleado inválido', 'Error');
    return false;
  }
  
  if (this.empleadosFiltrados.length === 1) {
    const confirmacion = confirm(
      'Este es el único empleado del departamento. ¿Está seguro que desea eliminarlo?'
    );
    return confirmacion;
  }
  
  return true;
}

  eliminarEmpleado(empleado: EmpleadoSimple): void {
   if (!this.validarEliminacion(empleado)) {
    return;
  }
  
  this.empleadoAEliminar = empleado;
  this.modalEliminarVisible = true;
  this.menuEmpleadoAbiertoId = null;
}

  cerrarModal(): void {
    this.modalVisible = false;
    this.modalEditarVisible = false;
    this.empleadoAEditar = undefined;
  }

  onEmpleadoCreado(empleado: any): void {
    if (this.departamento) {
      this.departamentoService.getDepartamentosConEmpleados().subscribe(data => {
        const encontrado = data.find(d => d.id === this.departamento!.id);
        if (encontrado) {
          this.seleccionarDepartamento(encontrado);
        }
      });
    }
  }

  onEmpleadoEditado(empleado: any): void {
    if (this.departamento) {
      this.departamentoService.getDepartamentosConEmpleados().subscribe(data => {
        const encontrado = data.find(d => d.id === this.departamento!.id);
        if (encontrado) {
          this.seleccionarDepartamento(encontrado);
        }
      });
    }
  }
}

