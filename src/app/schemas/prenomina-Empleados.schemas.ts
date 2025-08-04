export interface RegistroPrenomina {
  codigoEmpleado: string;
  nombreEmpleado: string;
  sueldoBase: number;
  horasExtras: number;
  Bonos: number;
  comisiones: number;
  gratificaciones: number;
  aguinaldoProporcional: number;
  primaVacacional: number;
  imss: number;
  infonavit: number;
  otrasDeducciones: number;
  isr: number;
  totalNeto: number;
}


export interface PrenominaRequest {
  bono: number;
  comisiones: number;
  gratificaciones: number;
  aguinaldoProporcional: number;
  primaVacacional: number;
  imss: number;
  infonavit: number;
  otrasDeducciones: number;
}