import {Component, inject, OnInit, signal} from "@angular/core";
import {IProducto} from "./interfaces/producto.interface";
import {ProductosService} from "./service/productos.service";

@Component({
  selector: 'page-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {

  private readonly productosService = inject(ProductosService)

  public productos = signal<IProducto[]>([])

  ngOnInit(): void {
    this.obtenerProductos()
  }

  protected obtenerProductos() {
    this.productosService.getProductos().subscribe({
        next: (response) => {
          const {data, message, success} = response
          if(!success){
            console.error(message)
            return
          }
          this.productos.set(data)
        },
        error: (error) => {
          console.log(error)
        },
      }
    )
  }
}