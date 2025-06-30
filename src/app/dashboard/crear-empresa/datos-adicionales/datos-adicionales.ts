import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-adicionales',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datos-adicionales.html',
  styleUrls: ['./datos-adicionales.css']
})
export class DatosAdicionales implements OnInit {

  formDatosAdicionales!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formDatosAdicionales = this.fb.group({
      calle: ['', Validators.required],
      numInterno: [''],
      numExterno: ['', Validators.required],
      colonia: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono1: ['', Validators.required],
      telefono2: [''],
      nombreRepresentante: ['', Validators.required],
      apellidoPaternoRepresentante: ['', Validators.required],
      apellidoMaternoRepresentante: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formDatosAdicionales.valid) {
      console.log(this.formDatosAdicionales.value);
    } else {
      this.formDatosAdicionales.markAllAsTouched();
    }
  }

}
