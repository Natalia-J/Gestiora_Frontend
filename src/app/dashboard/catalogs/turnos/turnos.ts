import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService, CatalogoItem} from '../../../services/catalogosService';
import { Turno, TurnoRequest, TurnoService } from '../../../services/turno-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Turnos implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  
  turnoForm!: FormGroup;
  turnos: Turno[] = [];
  tipoJornadas: CatalogoItem[] = [];

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private catalogosService: CatalogosService
  ) {}

  transformarTipoJornada(tipo: string): string {
    if (!tipo) return '';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
  }
  

  ngOnInit(): void {
    this.turnoForm = this.fb.group({
      nombreTurno: ['', Validators.required],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      tipoJornada: [null, Validators.required]
    });

    this.cargarTurnos();
    this.cargarTipoJornadas();
  }

  cargarTurnos() {
    this.turnoService.obtenerTurnos().subscribe({
      next: (data) => (this.turnos = data),
      error: (err) => console.error('Error cargando turnos', err)
    });
  }

  cargarTipoJornadas() {
    this.catalogosService.getCatalogos().subscribe({
      next: (data) => {
        this.tipoJornadas = data.tipoJornada;
      },
      error: (err) => console.error('Error cargando tipoJornadas', err)
    });
  }

  enviar() {
    if (this.turnoForm.invalid) return;

    const turno: TurnoRequest = this.turnoForm.value;

    this.turnoService.crearTurno(turno).subscribe({
      next: () => {
        this.turnoForm.reset();
        this.cargarTurnos();
      },
      error: (err) => console.error('Error al crear turno', err)
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
