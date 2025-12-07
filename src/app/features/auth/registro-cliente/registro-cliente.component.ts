import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ClienteRegistroDto {
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
  nombreUsuario: string;
  contrasena: string;
}

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-cliente.component.html'
})
export class RegistroClienteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/cliente/registro`;

  registerForm: FormGroup;
  submitted = false;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerForm.invalid) {
      return;
    }

    this.loading.set(true);

    const clienteData: ClienteRegistroDto = this.registerForm.value;

    this.http.post<any>(this.API_URL, clienteData).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.successMessage.set('¡Registro exitoso! Redirigiendo al login...');
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        } else {
          this.errorMessage.set(response.message || 'Error al registrar');
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al registrar. Intenta nuevamente.'
        );
      }
    });
  }
}
