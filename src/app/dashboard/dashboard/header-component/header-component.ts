import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() crearElemento = new EventEmitter<string>();

  router = inject(Router);

  dropdownAbierto = false;

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  goSelector(){
    this.router.navigate(['/select'])
  }

getCompanyName(){
  let companyName = localStorage.getItem('companyName')
  if(companyName){
    return companyName;
  }
  return "Dashboard de tu empresa"
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
