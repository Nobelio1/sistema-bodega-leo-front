import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  submitted = false;
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdminOrTrabajador()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/inicio']);
      }
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading.set(false);
        // La redirección se maneja en el servicio
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Usuario o contraseña incorrectos'
        );
      }
    });
  }
}
