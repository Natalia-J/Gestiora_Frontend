export interface ZonaSalario {
  id: number;
  zonaSalario: string;
}

export interface Direccion {
  id: number;
  calleEmpresa: string;
  numInterno: string;
  numExterno: string;
  coloniaEmpresa: string;
  codigoPostalEmpresa: string;
  localidadEmpresa: string;
}

export interface TipoCodigoEmpleado {
  id: number;
  codigo: string;
}

export interface RegimenFiscal {
  id: number;
  regimenEmpresa: string;
}

export interface Empresa {
  id: number;
  nombre: string;
  mascarilla: string;
  vigencia: number;
  fecha_inicio: string;
  factor: number;
  telefono1: string;
  telefono2: string;
  patronalIMSS: string;
  rfc: string;
  infonavit: string;
  nombreRepresentante: string;
  apellidoPaRepresentante: string;
  apellidoMaRepresentante: string;
  zonaSalario: ZonaSalario;
  direccionCompany: Direccion;
  tipoCodigoEmpleado: TipoCodigoEmpleado;
  regimenFiscalCompany: RegimenFiscal;
  tipoPeriodo: any; 
}

export interface TipoContrato {
  id: number;
  contrato: string;
}

export interface TipoPeriodoEmpleado {
  id: number;
  tipoPeriodoEmpleado: string;
}

export interface BaseCotizacion {
  id: number;
  baseCotizacion: string;
}

export interface Sindicato {
  id: number;
  sindicato: string;
}

export interface TipoPrestacion {
  id: number;
  tipoPrestacionEmpleado: string;
}

export interface MetodoPago {
  id: number;
  metodoPago: string;
}

export interface BaseDePago {
  id: number;
  baseDePago: string;
}

export interface TipoJornada {
  id: number;
  tipoJornada: string;
  horaInicio: string;
  horaFin: string;
  duracionMaxima: number;
}

export interface DiaDescanso {
  id: number;
  diaSemana: string;
}

export interface Turno {
  id: number;
  nombre: string;
  horaEntrada: string;
  horaSalida: string;
  horasTurno: number;
  tipoJornada: TipoJornada;
  diasDescanso: DiaDescanso[];
}

export interface RegimenEmployee {
  id: number;
  regimenFiscalEmployee: string;
}

export interface Genero {
  id: number;
  genero: string;
}

export interface EstadoCivil {
  id: number;
  estadoCivilEmpleado: string;
}

export interface EntidadFederativa {
  id: number;
  entidadFederativa: string;
}

export interface Empleado {
  id: number;
  codigoEmpleado: string;
  empresa: Empresa;
  nombreEmpleado: string;
  apellidoPaternoEmpleado: string;
  apellidoMaternoEmpleado: string;
  salarioDiario: number;
  fechaAlta: string;
  numeroEmpleado: string;
  sbcParteFija: number;
  sbcParteVariable: number;
  tipadoUmas: number;
  aforeEmpleado: string;
  correoEmpleado: string;
  numSeguridadSocial: string;
  registroPatronalIMSS: string;
  fechaNacimientoEmpleado: string;
  ciudadNacimientoEmpleado: string;
  curpEmpleado: string;
  rfcEmpleado: string;
  puesto: string | null;
  tipoContratoEmpleado: TipoContrato;
  tipoPeriodo: TipoPeriodoEmpleado;
  baseCotizacion: BaseCotizacion;
  sindicatoEmpleado: Sindicato;
  tipoPrestacionEmpleado: TipoPrestacion;
  metodoPagoEmpleado: MetodoPago;
  direccionEmployee: Direccion;
  zonaSalario: ZonaSalario;
  baseDePago: BaseDePago;
  turno: Turno;
  regimenEmployee: RegimenEmployee;
  genero: Genero;
  estadoCivil: EstadoCivil;
  entidadFederativa: EntidadFederativa;
  nombreCompleto: string;
}

export interface Departamento {
  id: number;
  codigo: string;
  nombreDepartamento: string;
  empleados: Empleado[];
}
