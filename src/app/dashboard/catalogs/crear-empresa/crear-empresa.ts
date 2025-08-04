import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DatosGenerales } from './datos-generales/datos-generales';
import { DatosAdicionales } from './datos-adicionales/datos-adicionales';
import { Registros } from './registros/registros';
import { EmpresaService } from '../../../services/empresaService';

@Component({
  selector: 'app-crear-empresa',
  standalone: true,
  imports: [CommonModule, DatosGenerales, DatosAdicionales, Registros],
  templateUrl: './crear-empresa.html',
  styleUrls: ['./crear-empresa.css']
})
export class CrearEmpresa {
  @Output() cerrarModal = new EventEmitter<void>();

  @ViewChild(DatosGenerales) datosGeneralesComponent!: DatosGenerales;
  @ViewChild(DatosAdicionales) datosAdicionalesComponent!: DatosAdicionales;
  @ViewChild(Registros) registroComponent!: Registros;

  activeTab: string = 'generales';

  constructor(private empresaService: EmpresaService) {}



  guardar(): void {
    const formGeneral = this.datosGeneralesComponent?.formDatosGenerales;
    const formAdicional = this.datosAdicionalesComponent?.formDatosAdicionales;
    const formRegistros = this.registroComponent?.formDatosRegistro;

    if (formGeneral?.valid && formAdicional?.valid && formRegistros?.valid) {
      const datosGenerales = formGeneral.value;
      const datosAdicionales = formAdicional.value;
      const registros = formRegistros.value;

      const datosCompletos = {
        datosGenerales,
        datosAdicionales,
        registros
      };

      this.empresaService.guardarEmpresa(datosCompletos).subscribe({
        next: () => {
          console.log('Empresa guardada con éxito');
          this.cerrarModal.emit();
        },
        error: (error) => {
          console.error('Error guardando empresa:', error);
        }
      });
    } else {
      formGeneral?.markAllAsTouched();
      formAdicional?.markAllAsTouched();
      formRegistros?.markAllAsTouched();
    }
  }

  formulariosValidos(): boolean {
    return (
      this.datosGeneralesComponent?.formDatosGenerales?.valid &&
      this.datosAdicionalesComponent?.formDatosAdicionales?.valid &&
      this.registroComponent?.formDatosRegistro?.valid
    );
  }

  cerrar(): void {
    this.cerrarModal.emit();
  }
}
