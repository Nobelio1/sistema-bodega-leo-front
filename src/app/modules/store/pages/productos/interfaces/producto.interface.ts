import {IDataResponse} from "../../../../../shared/interfaces/api.interface";

export interface IProducto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  cantidad: number;
  nombreCategoria: string;
}

export interface ListaProductos extends IDataResponse {
  data: IProducto[];
}