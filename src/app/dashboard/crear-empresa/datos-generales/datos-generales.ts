import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../services/catalogosService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-generales',
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './datos-generales.html',
  styleUrls: ['./datos-generales.css']
})
export class DatosGenerales implements OnInit {

  tipoCodigoEmpleado: { id: string; name: string }[] = [];
  zonaSalarioGeneral: { id: string; name: string }[] = [];


  formDatosGenerales!: FormGroup;

  constructor(private catalogosService: CatalogosService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formDatosGenerales = this.fb.group({
      nombreEmpresa: ['', Validators.required],
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

  onSubmit() {
    if (this.formDatosGenerales.valid) {
      console.log(this.formDatosGenerales.value);
    } else {
      this.formDatosGenerales.markAllAsTouched();
    }
  }
}
