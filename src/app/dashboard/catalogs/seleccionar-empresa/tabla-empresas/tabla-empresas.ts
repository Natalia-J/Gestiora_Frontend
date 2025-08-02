import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Empresa } from '../../../../services/empresa-selec-service';

@Component({
  selector: 'app-tabla-empresas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-empresas.html',
  styleUrls: ['./tabla-empresas.css']
})
export class TablaEmpresas {
  @Input() empresas: Empresa[] = [];
  @Output() seleccionar = new EventEmitter<Empresa>();

  empresaSeleccionada?: Empresa;

  seleccionarEmpresa(empresa: Empresa) {
    this.empresaSeleccionada = empresa;
    this.seleccionar.emit(empresa);
  }
}
