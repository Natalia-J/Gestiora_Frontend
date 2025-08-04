export interface RegistroEmpleado {
  codigoEmpleado: string;
  nombreEmpleado: string;
  diasTrabajados: number;
  faltas: number;
  retardos: number;
  salidatemprana: number;
  horasExtras: number;
  diasDescansoTrabajados: number;
}


export interface PeriodoRequest {
  tipoPeriodoId: number;
  periodoId: number;
}
