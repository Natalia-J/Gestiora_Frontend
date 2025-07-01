import { Component, OnInit } from '@angular/core';
import { EmpresaSelecService } from '../../services/empresa-selec-service';
import { CommonModule } from '@angular/common';
import { TablaEmpresas } from './tabla-empresas/tabla-empresas';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seleccionar-empresa',
  standalone: true,
  imports: [CommonModule, TablaEmpresas],
  templateUrl: './seleccionar-empresa.html',
  styleUrls: ['./seleccionar-empresa.css']
})
export class SeleccionarEmpresa implements OnInit {
  empresas: any[] = [];
  empresaSeleccionadaModal: any = null;

  constructor(
    private empresaService: EmpresaSelecService,
    private dialogRef: MatDialogRef<SeleccionarEmpresa>
  ) {}

  ngOnInit(): void {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
      }
    });
  }

  seleccionarEmpresa(empresa: any) {
    this.empresaSeleccionadaModal = empresa;
  }

  confirmarSeleccion() {
    if (this.empresaSeleccionadaModal) {
      this.dialogRef.close(this.empresaSeleccionadaModal);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
