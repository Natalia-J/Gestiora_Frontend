import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() crearElemento = new EventEmitter<string>();

  dropdownAbierto = false;

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  enviarElemento(tipo: string) {
    this.crearElemento.emit(tipo);
  }

  cerrarDropdown() {
    setTimeout(() => {
      this.dropdownAbierto = false;
    }, 150);
  }

  crear(tipo: string) {
    this.crearElemento.emit(tipo);
    this.dropdownAbierto = false;
  }

  

}
