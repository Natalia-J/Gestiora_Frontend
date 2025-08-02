import { Component } from '@angular/core';
import { Modal } from '../modal/modal';
import { CrearEmpresa } from '../../dashboard/catalogs/crear-empresa/crear-empresa';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-boton-modal',
  templateUrl: './boton-modal.html',
  styleUrls: ['./boton-modal.css'] 
})
export class BotonModal {
  constructor(private dialog: MatDialog) {}

  abrirModal() {
    this.dialog.open(Modal, {
      panelClass: 'modal-tamano-grande',
      data: {
        component: CrearEmpresa
      }
    });
  }

  
}
