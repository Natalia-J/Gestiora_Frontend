import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DepartamentoComponent } from '../../catalogs/departamento/departamento';
import { DiasHoras } from '../../catalogs/dias-horas/dias-horas';
import { NominaView, Prenomina } from '../../catalogs/prenomina/prenomina';
import { Nomina } from '../../catalogs/nomina/nomina';
import { Reportes } from '../../catalogs/reportes/reportes';
import { Percepciones } from '../../catalogs/percepciones/percepciones';
import { Deducciones } from '../../catalogs/deducciones/deducciones';
import { Turnos } from '../../catalogs/turnos/turnos';
import { Puestos } from '../../catalogs/puestos/puestos';
import { DepartamentoInterno } from '../../catalogs/departamento/departamento-interno/departamento-interno';
import { DepartamentoItem } from '../../../services/departamento-service';

@Component({
  selector: 'app-content-component',
  standalone:true,
  imports: [ CommonModule, DepartamentoInterno, DepartamentoComponent, DiasHoras,Percepciones, Deducciones, Prenomina, Nomina, Reportes, Turnos, Puestos],
  templateUrl: './content-component.html',
  styleUrl: './content-component.css'
})
export class ContentComponent {
  @Input() vistaActiva: string = '';
  idEmployee! :number
  departamentoSeleccionadoInterno?: DepartamentoItem;

  mostrarVista(vista: string, departamento?: DepartamentoItem) {
    this.vistaActiva = vista;
    if (departamento) {
      this.departamentoSeleccionadoInterno = departamento;
    }
  }

  cambiarVista(event: NominaView){
    this.idEmployee = event.idEmployee
      this.vistaActiva = event.vista
  }
  

  manejarCrear(event: any) {
    console.log('crear:', event);
  }

  /*mostrarVista(vista: string) {
    this.vistaActiva = vista;
  }*/

}
