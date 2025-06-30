import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../services/catalogosService';

@Component({
  selector: 'app-registros',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registros.html',
  styleUrl: './registros.css'
})
export class Registros implements OnInit {

  regimenEmpresa: { id: string; name: string }[] = [];

  formDatosRegistro!: FormGroup;

  constructor(private catalogosService: CatalogosService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formDatosRegistro = this.fb.group({
      regimenEmpresa: ['', Validators.required],
      registroPatronalIMSS: ['', Validators.required],
      rfc: ['', Validators.required],
      registroInfonavit: ['']
    });

    this.catalogosService.getCatalogos().subscribe({
      next: (catalogos) => {
        console.log('catalogos recibidos', catalogos);
        this.regimenEmpresa = catalogos.regimenEmpresa || [];
      },
      error: (error) => console.error('Error al cargar catálogo de régimen fiscal', error)
    });
  }

  onSubmit() {
    if (this.formDatosRegistro.valid) {
      console.log(this.formDatosRegistro.value);
    } else {
      this.formDatosRegistro.markAllAsTouched();
    }
  }

}
