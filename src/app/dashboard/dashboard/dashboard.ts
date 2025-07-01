import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CrearEmpresa } from '../crear-empresa/crear-empresa'; // Asegúrate de que el path sea correcto
import { SeleccionarEmpresa } from '../seleccionar-empresa/seleccionar-empresa';

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
    console.log('Abriendo modal de seleccionar empresa...');
  
    const dialogRef = this.dialog.open(SeleccionarEmpresa, {
      width: '700px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe((empresaSeleccionada) => {
      if (empresaSeleccionada) {
        console.log('Empresa seleccionada:', empresaSeleccionada);
        // Aquí puedes hacer algo con la empresa seleccionada
      } else {
        console.log('Selección cancelada');
      }
    });
  }
  

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }
}
