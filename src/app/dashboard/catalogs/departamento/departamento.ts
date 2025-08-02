import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentoItem, DepartamentoService } from '../../../services/departamento-service';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departamento.html',
  styleUrls: ['./departamento.css']
})
export class DepartamentoComponent implements OnInit {
  form!: FormGroup;
  departamentos: DepartamentoItem[] = [];
  cargando = false;
  error: string | null = null;
  mostrarModal = false;
  modoEliminar = false;


  @Output() departamentoSeleccionado = new EventEmitter<DepartamentoItem>();

  departamentoSeleccionadoId?: number;

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      nombreDepartamento: ['', Validators.required]
    });

    this.cargarDepartamentos();
  }

  seleccionar(depto: DepartamentoItem): void {
    console.log('Seleccionando departamento:', depto);
    this.departamentoSeleccionadoId = depto.id;
    this.departamentoSeleccionado.emit(depto);
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cancelar(): void {
    this.mostrarModal = false;
    this.form.reset();
  }

  cargarDepartamentos(): void {
    this.cargando = true;
    this.departamentoService.listar().subscribe({
      next: (data) => {
        this.departamentos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar departamentos.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (this.form.valid) {
      this.departamentoService.crearDepartamento(this.form.value).subscribe({
        next: () => {
          alert('Departamento creado con éxito.');
          this.error = null;
          this.form.reset();
          this.cargarDepartamentos();
          this.mostrarModal = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al crear departamento';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  activarModoEliminar(): void {
    this.modoEliminar = !this.modoEliminar;
    if (!this.modoEliminar) {
      this.departamentoSeleccionadoId = undefined;
    }
  }

  eliminarDepartamento(depto: DepartamentoItem): void {
    if (depto.codigo.toUpperCase() === 'GEN') {
      alert('No se puede eliminar el departamento general.');
      this.modoEliminar = false;
      return;
    }
  
    const confirmarEliminar = confirm(`¿Seguro que quieres eliminar el departamento "${depto.nombreDepartamento}"?`);
    if (!confirmarEliminar) {
      this.modoEliminar = false;
      return;
    }
  
    this.departamentoService.tieneEmpleados(depto.id).subscribe({
      next: (tiene) => {
        if (tiene) {
          const confirmarEliminarConEmpleados = confirm(
            'Este departamento tiene empleados. ¿Quieres eliminarlo junto con ellos?'
          );
          if (confirmarEliminarConEmpleados) {
            this.departamentoService.eliminarConEmpleados(depto.id).subscribe({
              next: () => {
                alert('Departamento y empleados eliminados con éxito.');
                this.cargarDepartamentos();
                this.modoEliminar = false;
              },
              error: (err) =>
                alert('Error al eliminar con empleados: ' + (err.error || 'Error desconocido'))
            });
          } else {
            this.modoEliminar = false;
          }
        } else {
          this.departamentoService.eliminar(depto.id).subscribe({
            next: () => {
              alert('Departamento eliminado con éxito.');
              this.cargarDepartamentos();
              this.modoEliminar = false;
            },
            error: (err) => {
              alert('Error al eliminar departamento: ' + (err.error || 'Error desconocido'));
              this.modoEliminar = false;
            }
          });
        }
      },
      error: () => {
        alert('Error al verificar empleados del departamento.');
        this.modoEliminar = false;
      }
    });
  }

  
}
