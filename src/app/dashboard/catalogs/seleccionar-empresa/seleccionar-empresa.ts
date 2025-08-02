import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmpresaSelecService } from '../../../services/empresa-selec-service';
import { CommonModule } from '@angular/common';
import { TablaEmpresas } from './tabla-empresas/tabla-empresas';

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

  modalVisible=true;
  @Output() empresaSeleccionada = new EventEmitter<any>();

  constructor(private empresaService: EmpresaSelecService) {}

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
      this.empresaSeleccionada.emit(this.empresaSeleccionadaModal);
      this.modalVisible=false;
    }
  }

  cancelar() {
    this.modalVisible=false;
  }
}
