import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosResponse, CatalogosService } from '../../../services/catalogosService';
import { EmpleadoService } from '../../../services/empleado-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empleado',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './empleado.html',
  styleUrl: './empleado.css'
})
export class Empleado implements OnInit {
  empleadoForm!: FormGroup;
  catalogos!: CatalogosResponse;
  turnos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private catalogosService: CatalogosService
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      empresaId: [1, Validators.required],
      codigoEmpleado: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaAlta: ['', Validators.required],
      tipoContrato: [null, Validators.required],
      tipoPeriodo: [null, Validators.required],
      salarioDiario: [null, Validators.required],
      baseCotizacion: [null, Validators.required],
      sbcParteFija: [null, Validators.required],
      sbcParteVariable: [null, Validators.required],
      tipadoUmas: [null, Validators.required],
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
      numTelefono: ['', Validators.required],
      numSeguridadSocial: ['', Validators.required],
      registroPatronalImss: ['', Validators.required],
      estadoCivil: [null, Validators.required],
      genero: [null, Validators.required],
      fechaNacimiento: ['', Validators.required],
      entidadFederativa: [null, Validators.required],
      ciudad: ['', Validators.required],
      curp: ['', Validators.required],
      rfc: ['', Validators.required],
      direccion: this.fb.group({
        calle: ['', Validators.required],
        numExterno: ['', Validators.required],
        numInterno: [''],
        colonia: ['', Validators.required],
        codigoPostal: ['', Validators.required],
        localidad: ['', Validators.required],
      }),
      avisosPendientesImss: [0]
    });

    this.catalogosService.getCatalogos().subscribe((data) => {
      this.catalogos = data;
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.invalid) return;
    const formData = this.empleadoForm.value;
    this.empleadoService.crearEmpleado(formData).subscribe({
      next: () => {
        alert('Empleado creado con éxito');
        this.empleadoForm.reset();
      },
      error: (err) => {
        console.error('Error al registrar empleado:', err);
        alert('Hubo un error al registrar el empleado.');
      }
    });
  }

  cerrar(): void {
    // Aquí puedes emitir un evento o simplemente ocultar el modal
  }

}
