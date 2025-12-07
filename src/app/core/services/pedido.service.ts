import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DetallePedido {
  idProducto: number;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface CrearPedidoDto {
  idCliente: number;
  idEstado: number;
  montoTotal: number;
  detallePedido: DetallePedido[];
}

export interface PedidoRes {
  idPedido: number;
  fechaPedido: string;
  horaPedido: string;
  montoTotal: number;
  codigoRecojo: string;
  nombreCliente: string;
  estadoPedido: string;
  totalPagado: number;
}

export interface PedidoDetalleRes extends PedidoRes {
  telefonoCliente: string;
  detalles: Array<{
    idDetalle: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

export interface DataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/pedido`;

  crearPedido(pedido: CrearPedidoDto): Observable<DataResponse<any>> {
    return this.http.post<DataResponse<any>>(this.API_URL, pedido);
  }

  obtenerPedidoPorId(id: number): Observable<DataResponse<PedidoDetalleRes>> {
    return this.http.get<DataResponse<PedidoDetalleRes>>(`${this.API_URL}/${id}`);
  }

  listarPedidos(pagina: number = 0, limite: number = 10): Observable<DataResponse<PageResponse<PedidoRes>>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('limite', limite.toString());
    return this.http.get<DataResponse<PageResponse<PedidoRes>>>(this.API_URL, { params });
  }

  listarPedidosPorCliente(idCliente: number, pagina: number = 0, limite: number = 10): Observable<DataResponse<PageResponse<PedidoRes>>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('limite', limite.toString());
    return this.http.get<DataResponse<PageResponse<PedidoRes>>>(`${this.API_URL}/cliente/${idCliente}`, { params });
  }

  buscarPorCodigoRecojo(codigo: string): Observable<DataResponse<PedidoDetalleRes>> {
    return this.http.get<DataResponse<PedidoDetalleRes>>(`${this.API_URL}/codigo/${codigo}`);
  }

  actualizarPedido(id: number, data: { idEstado: number }): Observable<DataResponse<any>> {
    return this.http.put<DataResponse<any>>(`${this.API_URL}/${id}`, data);
  }

  cambiarEstadoPedido(id: number, idEstado: number): Observable<DataResponse<any>> {
    return this.http.patch<DataResponse<any>>(`${this.API_URL}/${id}/estado/${idEstado}`, {});
  }

  cancelarPedido(id: number): Observable<DataResponse<any>> {
    return this.http.patch<DataResponse<any>>(`${this.API_URL}/${id}/cancelar`, {});
  }
}
