export interface EmpleadoRequest {
  codigoEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaAlta: string;
  tipoContrato: number;
  tipoPeriodo: number;
  salarioDiario: number;
  baseCotizacion: number;
  departamento: number;
  puesto: number;
  sindicato: number;
  tipoPrestacion: number;
  baseDePago: number;
  metodoPago: number;
  turnoTrabajo: number;
  zonaSalario: number;
  tipoRegimen: number;
  afore: string;
  correo: string;
  numTelefono: string;
  numSeguridadSocial: string;
  registroPatronalImss: string;
  estadoCivil: number;
  genero: number;
  fechaNacimiento: string;
  entidadFederativa: number;
  ciudad: string;
  curp: string;
  rfc: string;
  direccion: {
    calle: string;
    numExterno: string;
    numInterno?: string;
    colonia: string;
    codigoPostal: string;
    localidad: string;
  };
}

export interface EmpleadoResponse {
  id: string;
  codigoEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  numTelefono: string;
  fechaAlta: string;
  fechaCreacion: string;
  activo: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface moverEmpleado{ 
  empleadoId: number;
  nuevoDepartamentoId: number;
}