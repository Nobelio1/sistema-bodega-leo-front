import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegistrarPagoDto {
  idPedido: number;
  metodoPago: 'YAPE' | 'PLIN' | 'EFECTIVO';
  monto: number;
  transferenciaDetalle?: {
    nombreBanco: string;
    depositante: string;
    tokenTransferencia: string;
  };
}

export interface PagoRes {
  idPago: number;
  monto: number;
  metodo: string;
  estadoPago: string;
  fechaPago: string;
  codigoTransaccion: string;
}

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/pago`;

  registrarPago(pago: RegistrarPagoDto): Observable<any> {
    return this.http.post(`${this.API_URL}`, pago);
  }

  obtenerPagoPorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  obtenerPagosPorPedido(idPedido: number): Observable<any> {
    return this.http.get(`${this.API_URL}/pedido/${idPedido}`);
  }

  confirmarPago(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/confirmar`, {});
  }

  verificarTransaccion(codigoTransaccion: string): Observable<any> {
    return this.http.get(`${this.API_URL}/verificar/${codigoTransaccion}`);
  }

  eliminarPago(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
