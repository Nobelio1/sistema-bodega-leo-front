import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface Usuario {
  token: string;
  rol: 'CLIENTE' | 'TRABAJADOR' | 'ADMIN';
  nombreUsuario: string;
}

export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  contrasena: string;
  rol: 'CLIENTE' | 'TRABAJADOR' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  public currentUser = signal<Usuario | null>(null);
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {

        if (response.success && response.data.token) {
          this.handleAuthSuccess(response.data.token, credentials.nombreUsuario);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          this.handleAuthSuccess(response.data.token, data.nombreUsuario);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.rol) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(['ADMIN']);
  }

  isTrabajador(): boolean {
    return this.hasRole(['TRABAJADOR']);
  }

  isCliente(): boolean {
    return this.hasRole(['CLIENTE']);
  }

  isAdminOrTrabajador(): boolean {
    return this.hasRole(['ADMIN', 'TRABAJADOR']);
  }

  private handleAuthSuccess(token: string, nombreUsuario: string): void {
    const decodedToken = this.decodeToken(token);
    const usuario: Usuario = {
      token,
      rol: decodedToken.rol,
      nombreUsuario
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.currentUser.set(usuario);
    this.isAuthenticated.set(true);

    // Redirigir según el rol
    if (this.isAdminOrTrabajador()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const usuario = JSON.parse(userData) as Usuario;
        if (this.isTokenValid(token)) {
          this.currentUser.set(usuario);
          this.isAuthenticated.set(true);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      return {};
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const exp = decoded.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      return false;
    }
  }
}
