export interface Empresa {
  id: number;
  nombre: string;
  mascarilla: string;
  vigencia: number;
  fecha_inicio: string; // ISO date string: "YYYY-MM-DD"
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
  direccionCompany: DireccionCompany;
  tipoCodigoEmpleado: TipoCodigoEmpleado;
  regimenFiscalCompany: RegimenFiscalCompany;
  tipoPeriodo: TipoPeriodo | null;
}

export interface ZonaSalario {
  id: number;
  zonaSalario: string;
}

export interface DireccionCompany {
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

export interface RegimenFiscalCompany {
  id: number;
  regimenEmpresa: string;
}

export type TipoPeriodo = any; // O define una interfaz si sabes su estructura
