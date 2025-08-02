import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../../services/catalogosService';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpresaService } from '../../../../services/empresaService';

@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datos-generales.html',
  styleUrls: ['./datos-generales.css']
})
export class DatosGenerales implements OnInit {

  tipoCodigoEmpleado: { id: string; name: string }[] = [];
  zonaSalarioGeneral: { id: string; name: string }[] = [];

  formDatosGenerales!: FormGroup;

  constructor(private catalogosService: CatalogosService, private fb: FormBuilder, private empresaService:EmpresaService) {}

  ngOnInit(): void {
    this.formDatosGenerales = this.fb.group({
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      mascarillaCodigo: ['', [Validators.required, Validators.pattern(/^X+$/)]],
      tipoCodigoEmpleado: ['', Validators.required],
      ejercicioVigente: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      fechaInicioHistorial: ['', Validators.required],
      zonaSalarioGeneral: ['', Validators.required],
      factorNoDeducible: ['', [Validators.required, Validators.min(0)]],
    });

    this.catalogosService.getCatalogos().subscribe({
      next: (catalogos) => {
        this.tipoCodigoEmpleado = catalogos.tipoCodigoEmpleado;
        this.zonaSalarioGeneral = catalogos.zonaSalarioGeneral;
      },
      error: (error) => console.error('Error al cargar catálogos', error)
    });
  }

  soloX(event: Event): void {
    const input = event.target as HTMLInputElement;
    const soloX = input.value.toUpperCase().replace(/[^X]/g, '');
    input.value = soloX;
    this.formDatosGenerales.get('mascarillaCodigo')?.setValue(soloX, { emitEvent: false });
  }

  soloNumerosFactor(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 &&
      charCode !== 0
    ) {
      event.preventDefault();
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 8 &&
      charCode !== 46 && 
      charCode !== 37 &&
      charCode !== 39
    ) {
      event.preventDefault();
    }
  }
  
  


  onSubmit() {
    if (this.formDatosGenerales.valid) {
      this.empresaService.guardarEmpresa(this.formDatosGenerales.value).subscribe({
        next: (res) => {
          console.log('Empresa creada con éxito', res);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.fieldErrors) {
            const errors = err.error.fieldErrors;
            Object.keys(errors).forEach(field => {
              if (this.formDatosGenerales.get(field)) {
                this.formDatosGenerales.get(field)?.setErrors({ backend: errors[field] });
              }
            });
          } else {
            alert('Error inesperado, intenta más tarde.');
          }
        }
      });
    } else {
      this.formDatosGenerales.markAllAsTouched();
    }
  }
  
}
