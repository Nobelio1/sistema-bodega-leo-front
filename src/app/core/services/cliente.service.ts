import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClienteRes {
  idCliente: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
  nombreUsuario: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/cliente`;

  obtenerClientePorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  listarClientes(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }
}
