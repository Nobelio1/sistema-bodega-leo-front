import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListaProductosResponse} from "../interfaces/producto.interface";
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ProductosService {

  private API_URL = `${environment.apiUrl}/producto`
  private http = inject(HttpClient);

  getProductos(): Observable<ListaProductosResponse> {
    return this.http.get<ListaProductosResponse>(this.API_URL);
  }

  getProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.API_URL, producto);
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, producto);
  }

  subirImagenProducto(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API_URL}/${id}/imagen`, formData);
  }

  cambiarEstadoProducto(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/cambiar-estado/${id}`, {});
  }

  actualizarStock(id: number, data: { stock: number, tipoActualizacion: boolean }): Observable<any> {
    return this.http.patch(`${this.API_URL}/actualizar-stock/${id}`, data);
  }
}
