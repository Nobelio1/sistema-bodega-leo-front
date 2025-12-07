import {IDataResponse} from '../../../shared/interfaces/api.interface';
export interface ListaProductos {
  content:          Content[];
  pageable:         Pageable;
  last:             boolean;
  totalElements:    number;
  totalPages:       number;
  first:            boolean;
  numberOfElements: number;
  size:             number;
  number:           number;
  sort:             Sort;
  empty:            boolean;
}

export interface Content {
  idProducto:      number;
  nombre:          string;
  descripcion:     string;
  imagen:          null;
  precio:          number;
  cantidad:        number;
  nombreCategoria: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  sort:       Sort;
  offset:     number;
  paged:      boolean;
  unpaged:    boolean;
}

export interface Sort {
  sorted:   boolean;
  unsorted: boolean;
  empty:    boolean;
}


export interface ListaProductosResponse extends IDataResponse {
  data: ListaProductos
}
