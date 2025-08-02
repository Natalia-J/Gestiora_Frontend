import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuestoService } from '../../../services/puesto-service';

@Component({
  selector: 'app-puestos',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './puestos.html',
  styleUrl: './puestos.css'
})
export class Puestos {
  @Output() cerrar = new EventEmitter<void>();

  form!: FormGroup;
  error: string = '';
  exito: boolean = false;

  constructor(private fb: FormBuilder, private puestosService: PuestoService) {}

  modalAbierto: boolean = true;


  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  guardar() {
    if (this.form.valid) {
      this.puestosService.crearPuesto(this.form.value).subscribe({
        next: () => {
          this.exito = true;
          this.error = '';
          this.form.reset();
        },
        error: (err) => {
          this.error = 'Error al crear el puesto';
          this.exito = false;
          console.error(err);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar() {
    this.exito = false;
    this.error = '';
    this.form.reset();
  }

  cerrarModal() {
    this.cerrar.emit();
  }

}
