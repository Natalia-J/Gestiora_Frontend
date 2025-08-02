import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentComponent } from './content-component/content-component';
import { HeaderComponent } from './header-component/header-component';
import { SidebarComponent } from './sidebar-component/sidebar-component';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[CommonModule, ContentComponent, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {

  vistaActiva: string = '';

  mostrarVista(vista: string) {
    this.vistaActiva = vista;
  }

  manejarCrear(event: any) {
    console.log('Acción crear desde header:', event);
  }

  
  
  

  /*constructor( private router:Router){}

  mostrarCrearEmpresa = false;
  mostrarSeleccionarEmpresa = false;
  mostrarDepartamento = false;
  mostrarTurnos = false;
  mostrarPuestos = false;
  mostrarEmpleados = false;
  mostrarDiasHoras = false;

  crearEmpresa(): void {
    this.cerrarTodosLosModales();
    this.mostrarCrearEmpresa = true;
  }

  seleccionarEmpresa(): void {
    this.cerrarTodosLosModales();
    this.mostrarSeleccionarEmpresa = true;
  }

  abrirDepartamento(): void {
    this.cerrarTodosLosModales();
    this.mostrarDepartamento = true;
  }

  abrirTurnos(): void {
    this.cerrarTodosLosModales();
    this.mostrarTurnos = true;
  }

  abrirPuestos(): void {
    this.cerrarTodosLosModales();
    this.mostrarPuestos = true;
  }

  abrirEmpleados(): void {
    this.cerrarTodosLosModales();
    this.mostrarEmpleados = true;
  }

  abrirDiasHoras(): void {
    this.cerrarTodosLosModales();
    this.mostrarDiasHoras = true;
  }

  cerrarTodosLosModales(): void {
    this.mostrarCrearEmpresa = false;
    this.mostrarSeleccionarEmpresa = false;
    this.mostrarDepartamento = false;
    this.mostrarTurnos = false;
    this.mostrarPuestos = false;
    this.mostrarEmpleados = false;
    this.mostrarDiasHoras = false;
  }*/
}
