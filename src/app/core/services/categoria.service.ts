import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  cantidadProductos?: number;
}

export interface CrearCategoriaDto {
  nombreCategoria: string;
  descripcion: string;
}

export interface DataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/categoria`;

  listarCategorias(): Observable<DataResponse<Categoria[]>> {
    return this.http.get<DataResponse<Categoria[]>>(this.API_URL);
  }

  obtenerCategoriaPorId(id: number): Observable<DataResponse<Categoria>> {
    return this.http.get<DataResponse<Categoria>>(`${this.API_URL}/${id}`);
  }

  crearCategoria(categoria: CrearCategoriaDto): Observable<DataResponse<any>> {
    return this.http.post<DataResponse<any>>(this.API_URL, categoria);
  }

  actualizarCategoria(id: number, categoria: CrearCategoriaDto): Observable<DataResponse<any>> {
    return this.http.put<DataResponse<any>>(`${this.API_URL}/${id}`, categoria);
  }

  eliminarCategoria(id: number): Observable<DataResponse<any>> {
    return this.http.delete<DataResponse<any>>(`${this.API_URL}/${id}`);
  }
}
