import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService, private fb: FormBuilder){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
    });
    // hacer un form con formGroup y conectarlo a tus inputs en el archivo login.html, y conectar la etiqueta form, al formGroup
  }
  get f(){
    return this.loginForm.controls;
  }

  // Que es CORS en la web
  // Como configurar CORS en mi proyecto de Spring Boot 

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

  loggearse(data: LoginRequest){
    console.log(data)
    this.authService.login(data).subscribe({
      next: () =>{
        console.log('Login exitoso')
      },
      error: (err) =>{
        console.log('Error al iniciar sesion', err)
      }
    });
  }

}
