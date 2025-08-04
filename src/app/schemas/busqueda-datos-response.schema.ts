export interface BusquedaDatosResponse {
  codigoEmpleado: string;
  departamentoId: number;
  empleadoId: number;
  turno: TurnoResponse;
  periodo: PeriodoEnRegistroResponse;
  registros: RegistrosDiaResponse[];
}

export interface TurnoResponse {
  nombreTurno: string;
  horaEntrada: string;
  horaSalida: string;
  horasTurno: number;
  tipoJornada: string;
  diasDescanso: Set<string>;
}

export interface PeriodoEnRegistroResponse {
  id: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface RegistrosDiaResponse {
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  horasTrabajadas: string;
  incosistencia: string;
}
