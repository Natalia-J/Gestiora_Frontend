import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../shared/schemas/login-request.schema';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!:FormGroup
  submitted=false

  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router:Router){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });

  }
  get f(){
    return this.loginForm.controls;
  }

  onSubmit(){
    this.submitted = true
    if (this.loginForm.invalid){
      return;
    }

    let loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this.loggearse(loginData);
  }

  loggearse(data: LoginRequest) {
  this.isLoading = true;
  this.authService.login(data).subscribe({
    next: () => {
      console.log('Login exitoso');
      this.router.navigate(['/select']);
    },
    error: (err) => {
      console.error('Error al iniciar sesión', err);
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
}
