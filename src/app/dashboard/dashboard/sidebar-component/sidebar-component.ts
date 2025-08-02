import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-component',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css'
})
export class SidebarComponent {
  @Output() cambiarVista = new EventEmitter<string>();
  expandido = false;
  activo: string=''

  toggleSidebar() {
    this.expandido = !this.expandido;
  }

  navegar(vista: string) {
    this.activo = vista;       
    this.cambiarVista.emit(vista);
  }
}
