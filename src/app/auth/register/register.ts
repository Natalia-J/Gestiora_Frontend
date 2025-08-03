import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  
onSubmit(): void {
  if (this.registerForm.valid) {
    const formValue = this.registerForm.value;

    this.authService.register(formValue).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Error al registrar:', err);
        this.errorMessage = err.error?.message || 'Ocurrió un error al registrar';
      }
    });
  }
}
}
