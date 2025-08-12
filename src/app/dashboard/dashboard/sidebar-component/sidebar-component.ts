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
  expandido = true;
  activo: string=''

  private clickCount = 0;
  private clickTimer: any;

  toggleSidebar() {
    this.clickCount++;
    
    if (this.clickCount === 1) {
      this.clickTimer = setTimeout(() => {
        this.clickCount = 0;
      }, 300);
    } else if (this.clickCount === 2) {
      clearTimeout(this.clickTimer);
      this.clickCount = 0;
      this.expandido = !this.expandido;
    }
  }

  navegar(vista: string) {
    this.activo = vista;
    this.cambiarVista.emit(vista);
  }
}
