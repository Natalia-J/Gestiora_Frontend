import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../../services/catalogosService';
import { PeriodoEmpresaRequest, PeriodosService } from '../../../../services/periodos';

interface CatalogoItem {
  id: string;
  name: string;
}

interface DatosRegistro {
  regimenEmpresa: string;
  registroPatronalIMSS: string;
  rfc: string;
  registroInfonavit?: string;
}

@Component({
  selector: 'app-registros',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registros.html',
  styleUrls: ['./registros.css']
})
export class Registros implements OnInit {
regimenEmpresa: CatalogoItem[] = [];
  tipoPeriodo: CatalogoItem[] = [];
  
  formDatosRegistro!: FormGroup;
  
  isLoading = false;
  isSubmitting = false;

  constructor(
    private catalogosService: CatalogosService,
    private periodosService: PeriodosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCatalogos();
  }

  private initializeForm(): void {
    this.formDatosRegistro = this.fb.group({
      regimenEmpresa: ['', [Validators.required]],
      registroPatronalIMSS: ['', [Validators.required, Validators.minLength(10)]],
      rfc: ['', [Validators.required, Validators.pattern(/^[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9]$/)]],
      registroInfonavit: [''],
      periodoEmpresaId: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]]
    });
  }


  private loadCatalogos(): void {
    this.isLoading = true;
    
    this.catalogosService.getCatalogos().subscribe({
      next: (catalogos) => {
        console.log('Catálogos recibidos:', catalogos);
        this.regimenEmpresa = catalogos.regimenEmpresa || [];
        this.tipoPeriodo = catalogos.tipoPeriodo || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        this.isLoading = false;
      }
    });
  }


  onSubmit(): void {
    if (this.formDatosRegistro.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.enviarDatosPeriodo()
        .then((response) => {
          console.log('Registro completo guardado exitosamente:', response);
          this.handleSuccessSubmit(response);
        })
        .catch((error) => {
          console.error('Error al guardar registro:', error);
          this.handleErrorSubmit(error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    } else {
      this.markFormGroupTouched();
    }
  }

   enviarDatosPeriodo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.formDatosRegistro.valid) {
        reject('Formulario inválido');
        return;
      }

      const formValues = this.formDatosRegistro.value;
      const periodoRequest: PeriodoEmpresaRequest = {
        periodoEmpresaId: parseInt(formValues.periodoEmpresaId, 10),
        fechaInicio: formValues.fechaInicio
      };

      console.log('Enviando datos del período:', periodoRequest);

      this.periodosService.crearPeriodo(periodoRequest).subscribe({
        next: (response) => {
          console.log('Período creado exitosamente:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error al crear período:', error);
          reject(error);
        }
      });
    });
  }


  getDatosRegistro(): DatosRegistro {
    const formValues = this.formDatosRegistro.value;
    return {
      regimenEmpresa: formValues.regimenEmpresa,
      registroPatronalIMSS: formValues.registroPatronalIMSS,
      rfc: formValues.rfc,
      registroInfonavit: formValues.registroInfonavit
    };
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.formDatosRegistro.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.formDatosRegistro.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio.';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
      }
      if (field.errors['pattern']) {
        return 'Formato inválido.';
      }
    }
    
    return '';
  }


  private markFormGroupTouched(): void {
    Object.keys(this.formDatosRegistro.controls).forEach(key => {
      const control = this.formDatosRegistro.get(key);
      control?.markAsTouched();
    });
  }


  private handleSuccessSubmit(response: any): void {
    // Aquí puedes agregar lógica adicional como mostrar un mensaje de éxito
    // o redirigir a otra página
    this.formDatosRegistro.reset();
  }


  private handleErrorSubmit(error: any): void {
  }
}
