import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GenerarComprobanteDto {
  idPedido: number;
  tipoComprobante: 'BOLETA' | 'FACTURA';
  datosFactura?: {
    ruc: string;
    razonSocial: string;
    direccionFiscal: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/comprobante`;

  generarComprobante(data: GenerarComprobanteDto): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  obtenerComprobantePorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  obtenerComprobantePorNumero(numero: string): Observable<any> {
    return this.http.get(`${this.API_URL}/numero/${numero}`);
  }

  obtenerComprobantePorPedido(idPedido: number): Observable<any> {
    return this.http.get(`${this.API_URL}/pedido/${idPedido}`);
  }

  listarComprobantes(pagina: number = 0, limite: number = 10, tipo?: string): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('limite', limite.toString());
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get(this.API_URL, { params });
  }

  descargarPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/pdf`, { responseType: 'blob' });
  }

  anularComprobante(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
