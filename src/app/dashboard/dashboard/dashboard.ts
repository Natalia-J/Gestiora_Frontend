import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CrearEmpresa } from '../crear-empresa/crear-empresa'; // Asegúrate de que el path sea correcto

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  crearEmpresa(): void {
    console.log('Abriendo modal para crear empresa...');

    this.dialog.open(CrearEmpresa, {
      width: '600px',
      disableClose: true
    });
  }

  seleccionarEmpresa(): void {
    console.log('Navegando a seleccionar empresa...');
    alert('Función seleccionar empresa - Implementar según tus necesidades');
  }

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }
}
