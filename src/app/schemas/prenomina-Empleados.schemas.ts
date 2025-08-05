// ===== INTERFACES PARA PRENÓMINA =====

export interface RegistroPrenomina {
  codigoEmpleado: string;
  nombreEmpleado: string;
  sueldoBase: number;
  horasExtras: number;
  Bonos: number; // Nota: mantiene la capitalización del backend
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

export interface PeriodoResponse {
  id: number;
  name: string;
  descripcion?: string;
  activo?: boolean;
}

export interface EmpleadoSummary {
  id: number;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento?: string;
  puesto?: string;
  activo: boolean;
}

// ===== TIPOS DE PERÍODOS =====
export enum TipoPeriodo {
  SEMANAL = 1,
  QUINCENAL = 2,
  MENSUAL = 3
}

export const PERIODO_NAMES: Record<TipoPeriodo, string> = {
  [TipoPeriodo.SEMANAL]: 'Semanal',
  [TipoPeriodo.QUINCENAL]: 'Quincenal',
  [TipoPeriodo.MENSUAL]: 'Mensual'
};

// ===== ESTADOS DE CARGA =====
export interface LoadingState {
  periodos: boolean;
  empleados: boolean;
  guardando: Record<string, boolean>;
}

// ===== CONFIGURACIÓN DE CAMPOS =====
export interface CampoConfiguracion {
  nombre: string;
  editable: boolean;
  tipo: 'currency' | 'number' | 'text';
  validacion?: {
    min?: number;
    max?: number;
    requerido?: boolean;
  };
}

export const CONFIGURACION_CAMPOS: Record<keyof Omit<RegistroPrenomina, 'codigoEmpleado' | 'nombreEmpleado'>, CampoConfiguracion> = {
  sueldoBase: {
    nombre: 'Sueldo Base',
    editable: false,
    tipo: 'currency'
  },
  horasExtras: {
    nombre: 'Horas Extras',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  Bonos: {
    nombre: 'Bonos',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  comisiones: {
    nombre: 'Comisiones',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  gratificaciones: {
    nombre: 'Gratificaciones',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  aguinaldoProporcional: {
    nombre: 'Aguinaldo Proporcional',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  primaVacacional: {
    nombre: 'Prima Vacacional',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  imss: {
    nombre: 'IMSS',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  infonavit: {
    nombre: 'INFONAVIT',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  otrasDeducciones: {
    nombre: 'Otras Deducciones',
    editable: true,
    tipo: 'currency',
    validacion: { min: 0 }
  },
  isr: {
    nombre: 'ISR',
    editable: false,
    tipo: 'currency'
  },
  totalNeto: {
    nombre: 'Total Neto',
    editable: false,
    tipo: 'currency'
  }
};

// ===== RESPUESTAS DE API =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PrenominaApiResponse extends ApiResponse<void> {
  empleadoId: number;
  tipoPeriodoId: number;
}

// ===== EVENTOS DEL COMPONENTE =====
export interface PrenominaEvents {
  onPeriodoChange: (periodoId: number) => void;
  onEmpleadoChange: (empleado: RegistroPrenomina, campo: string, valor: number) => void;
  onGuardarPrenomina: (empleado: RegistroPrenomina) => void;
  onCalcularTotal: (empleado: RegistroPrenomina) => number;
}

// ===== VALIDACIONES =====
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ===== CONSTANTES =====
export const PRENOMINA_CONSTANTS = {
  MIN_VALUE: 0,
  MAX_VALUE: 999999999.99,
  DECIMAL_PLACES: 2,
  CURRENCY_CODE: 'MXN',
  LOCALE: 'es-MX'
} as const;