export interface GuardarRegistroRequest {
  empleadoId: number;
  periodoId: number;
  fecha: string;         // Formato ISO 8601: 'YYYY-MM-DD'
  horaEntrada: string;   // Formato ISO 8601: 'HH:mm:ss'
  horaSalida: string;    // Formato ISO 8601: 'HH:mm:ss'
  inconsistenciaId: number;
}
