import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {Observable} from "rxjs";
import {ListaProductos} from "../interfaces/producto.interface";

@Injectable({providedIn: 'root'})
export class ProductosService {

  private API_URL = `${environment.apiUrl}/producto`
  private http = inject(HttpClient);

  getProductos(): Observable<ListaProductos> {
    return this.http.get<ListaProductos>(this.API_URL);
  }

}