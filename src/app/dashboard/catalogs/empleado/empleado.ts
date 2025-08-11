import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosResponse, CatalogosService } from '../../../services/catalogosService';
import { EmpleadoService } from '../../../services/empleado-service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoItem, DepartamentoService } from '../../../services/departamento-service';
import { Turno, TurnoService } from '../../../services/turno-service';
import { Puesto, PuestoService } from '../../../services/puesto-service';
import { EmpleadoSimple } from '../departamento/departamento-interno/departamento-interno';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './empleado.html',
  styleUrl: './empleado.css'
})
export class Empleado implements OnInit, OnDestroy {
  @Input() empleadoAEditar?: EmpleadoSimple;
  
  empleadoForm!: FormGroup;
  catalogos!: CatalogosResponse;
  departamentos: DepartamentoItem[] = [];
  turnos: Turno[] = [];
  puestos: Puesto[] = [];

  activeTab: string = 'obligatorios';
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  isEditMode: boolean = false;

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() empleadoCreado = new EventEmitter<any>();
  @Output() empleadoEditado = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private empleadoService = inject(EmpleadoService);
  private catalogosService = inject(CatalogosService);
  private toastr = inject(ToastrService);
  private departamentoService = inject(DepartamentoService);
  private turnoService = inject(TurnoService);
  private puestoService = inject(PuestoService);

  ngOnInit(): void {
    this.isEditMode = !!this.empleadoAEditar;
    this.initializeForm();
    this.loadCatalogos();
    this.loadDepartamentos();
    this.loadTurnos();
    this.loadPuestos();
    
    if (this.isEditMode && this.empleadoAEditar) {
      this.loadEmpleadoData();
    }
    
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  private initializeForm(): void {
    this.empleadoForm = this.fb.group({
      codigoEmpleado: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      fechaAlta: ['', Validators.required],
      tipoContrato: [null, Validators.required],
      tipoPeriodo: [null, Validators.required],
      salarioDiario: [null, [Validators.required, Validators.min(0.01)]],
      baseCotizacion: [null, [Validators.required,]],

      departamento: [null, Validators.required],
      puesto: [null, Validators.required],
      sindicato: [null, Validators.required],
      tipoPrestacion: [null, Validators.required],
      baseDePago: [null, Validators.required],
      metodoPago: [null, Validators.required],
      turnoTrabajo: [null, Validators.required],
      zonaSalario: [null, Validators.required],
      tipoRegimen: [null, Validators.required],
      afore: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      numTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],

      numSeguridadSocial: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      registroPatronalImss: ['', Validators.required],
      estadoCivil: [null, Validators.required],
      genero: [null, Validators.required],
      fechaNacimiento: ['', Validators.required],
      entidadFederativa: [null, Validators.required],
      ciudad: ['', Validators.required],
      curp: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/)]],
      rfc: ['', [Validators.required, Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/)]],

      direccion: this.fb.group({
        calle: ['', Validators.required],
        numExterno: ['', Validators.required],
        numInterno: [''],
        colonia: ['', Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        localidad: ['', Validators.required],
      }),

    });
  }

  private loadEmpleadoData(): void {
    if (!this.empleadoAEditar) return;
    
    this.isLoading = true;
    this.empleadoService.obtenerPorId(this.empleadoAEditar.id).subscribe({
      next: (empleado) => {
        this.populateForm(empleado);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar los datos del empleado', 'Error');
        this.isLoading = false;
      }
    });
  }

  private populateForm(empleado: any): void {
    this.empleadoForm.patchValue({
      codigoEmpleado: empleado.codigoEmpleado,
      nombre: empleado.nombreEmpleado,
      apellidoPaterno: empleado.apellidoPaternoEmpleado,
      apellidoMaterno: empleado.apellidoMaternoEmpleado,
      fechaAlta: empleado.fechaAlta ? this.formatDate(empleado.fechaAlta) : '',
      tipoContrato: empleado.tipoContrato?.id,
      tipoPeriodo: empleado.tipoPeriodo?.id,
      salarioDiario: empleado.salarioDiario,
      baseCotizacion: empleado.baseCotizacion?.id,
      
      departamento: empleado.departamento?.id,
      puesto: empleado.puesto?.id,
      sindicato: empleado.sindicato?.id,
      tipoPrestacion: empleado.tipoPrestacion?.id,
      baseDePago: empleado.baseDePago?.id,
      metodoPago: empleado.metodoPago?.id,
      turnoTrabajo: empleado.turnoTrabajo?.turnoid,
      zonaSalario: empleado.zonaSalario?.id,
      tipoRegimen: empleado.tipoRegimen?.id,
      afore: empleado.afore,
      correo: empleado.correo,
      numTelefono: empleado.numTelefono,

      numSeguridadSocial: empleado.numSeguridadSocial,
      registroPatronalImss: empleado.registroPatronalImss,
      estadoCivil: empleado.estadoCivil?.id,
      genero: empleado.genero?.id,
      fechaNacimiento: empleado.fechaNacimiento ? this.formatDate(empleado.fechaNacimiento) : '',
      entidadFederativa: empleado.entidadFederativa?.id,
      ciudad: empleado.ciudad,
      curp: empleado.curp,
      rfc: empleado.rfc,
      
      direccion: {
        calle: empleado.direccion?.calle || '',
        numExterno: empleado.direccion?.numExterno || '',
        numInterno: empleado.direccion?.numInterno || '',
        colonia: empleado.direccion?.colonia || '',
        codigoPostal: empleado.direccion?.codigoPostal || '',
        localidad: empleado.direccion?.localidad || '',
      },
    });
    console.log('turno:', empleado.turnoTrabajo?.tunoid);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  private loadCatalogos(): void {
    this.isLoading = true;
    this.catalogosService.getCatalogos().subscribe({
      next: (data) => {
        this.catalogos = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error al cargar los catálogos', 'Error');
        this.isLoading = false;
      }
    });
  }

  private loadDepartamentos(): void {
    this.departamentoService.listar().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: () => {
        this.toastr.error('Error al cargar los departamentos', 'Error');
      }
    });
  }

  private loadTurnos(): void {
    this.turnoService.obtenerTurnos().subscribe({
      next: (data) => {
        console.log(data)
        this.turnos = data;
      },
      error: () => {
        this.toastr.error('Error al cargar los turnos', 'Error');
      }
    });
  }

  private loadPuestos(): void {
    this.puestoService.obtenerTodos().subscribe({
      next: (data) => {
        console.log('puestos:', data)
        this.puestos = data;
      },
      error: () => {
        this.toastr.error('Error al cargar los puestos', 'Error');
      }
    });
  }

  onSubmit(): void {
    this.markAllFieldsAsTouched();

    if (this.empleadoForm.invalid) {
      this.toastr.warning('Complete todos los campos requeridos', 'Formulario incompleto');
      this.highlightFirstError();
      return;
    }

    this.isSubmitting = true;
    const formData = this.empleadoForm.value;

    if (this.isEditMode && this.empleadoAEditar) {
      this.empleadoService.editarEmpleado(this.empleadoAEditar.id, formData).subscribe({
        next: (response) => {
          this.toastr.success('Empleado actualizado exitosamente', '¡Éxito!');
          this.empleadoEditado.emit(response);
          this.cerrarModal.emit();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Ocurrió un error inesperado.', 'Error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.empleadoService.crearEmpleado(formData).subscribe({
        next: (response) => {
          this.toastr.success('Empleado creado exitosamente', '¡Éxito!');
          this.empleadoCreado.emit(response);
          this.cerrarModal.emit();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Ocurrió un error inesperado.', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.empleadoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.empleadoForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['email']) return 'Ingrese un correo válido';
    if (field.errors['pattern']) {
      if (fieldName === 'numTelefono') return 'Debe tener 10 dígitos';
      if (fieldName === 'numSeguridadSocial') return 'Debe tener 11 dígitos';
      if (fieldName === 'codigoPostal') return 'Debe tener 5 dígitos';
      if (fieldName === 'curp') return 'CURP inválido';
      if (fieldName === 'rfc') return 'RFC inválido';
      return 'Formato inválido';
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.empleadoForm.controls).forEach(key => {
      const control = this.empleadoForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private markFormGroupTouched(group: FormGroup): void {
    Object.values(group.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  private highlightFirstError(): void {
    const firstError = document.querySelector('.form-field__input--error, .form-field__select--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstError as HTMLElement).focus();
    }
  }

  cambiarTab(tab: string): void {
    this.activeTab = tab;
  }

  cerrar(): void {
    if (!this.isSubmitting) this.cerrarModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting) {
      this.cerrar();
    }
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !this.isSubmitting) {
      this.cerrar();
    }
  }

  get isObligatoriosTabValid(): boolean {
    const campos = ['codigoEmpleado', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaAlta', 'tipoContrato', 'tipoPeriodo', 'salarioDiario', 'baseCotizacion'];
    return campos.every(c => this.empleadoForm.get(c)?.valid);
  }

  get isGeneralesTabValid(): boolean {
    const campos = ['departamento', 'puesto', 'sindicato', 'tipoPrestacion', 'baseDePago', 'metodoPago', 'turnoTrabajo', 'zonaSalario', 'tipoRegimen', 'afore', 'correo', 'numTelefono'];
    return campos.every(c => this.empleadoForm.get(c)?.valid);
  }

  get isAfiliatoriosTabValid(): boolean {
    const campos = ['numSeguridadSocial', 'registroPatronalImss', 'estadoCivil', 'genero', 'fechaNacimiento', 'entidadFederativa', 'ciudad', 'curp', 'rfc'];
    const direccionValida = this.empleadoForm.get('direccion')?.valid;
    return campos.every(c => this.empleadoForm.get(c)?.valid) && !!direccionValida;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Editar Empleado' : 'Registro de Nuevo Empleado';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Actualizar Empleado' : 'Crear Empleado';
  }

  get submitButtonLoadingText(): string {
    return this.isEditMode ? 'Actualizando...' : 'Creando...';
  }

  debugTurno(): void {
  const turnoControl = this.empleadoForm.get('turnoTrabajo');
  console.log('Valor actual del turno:', turnoControl?.value);
  console.log('Turno válido:', turnoControl?.valid);
  console.log('Turno errores:', turnoControl?.errors);
  console.log('Turnos disponibles:', this.turnos);
  console.log('Form status:', this.empleadoForm.status);
}
}
