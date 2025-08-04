import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresaService';
import { Empresa } from './empresa.schema';
import { CrearEmpresa } from "../../catalogs/crear-empresa/crear-empresa";

@Component({
  selector: 'app-company-selector',
  imports: [CommonModule, CrearEmpresa],
  templateUrl: './company-selector.html',
  styleUrl: './company-selector.css'
})
export class CompanySelector implements OnInit {
   empresaService = inject(EmpresaService);
  router = inject(Router);
  
  empresas: Empresa[] = [];
  showCreateModal = false;
  showSelectModal = false;
  selectedEmpresa: Empresa | null = null;
  
  ngOnInit() {
    this.getEmpresas();
  }
  
  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (respuesta) => {
        this.empresas = respuesta;
        console.log('Datos:', this.empresas);
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }
  
  openCreateModal() {
    this.showCreateModal = true;
  }
  
  openSelectModal() {
    this.showSelectModal = true;
  }
  
  closeModals() {
    this.showCreateModal = false;
    this.showSelectModal = false;
    this.selectedEmpresa = null;
  }
  
  selectEmpresa(empresa: Empresa) {
    this.selectedEmpresa = empresa;
  }
  
  continuar() {
    if (this.selectedEmpresa) {
      localStorage.setItem('empresaId', this.selectedEmpresa.id.toString());
      localStorage.setItem('companyName', this.selectedEmpresa.nombre.toString())
      this.router.navigate(['/dashboard']);
    }
  }
}
