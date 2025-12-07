import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../pages/productos/service/productos.service';
import { CategoriaService, Categoria } from '../../../core/services/categoria.service';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  stockActual: number;
  refrigerado: boolean;
  idCategoria: number;
}

interface ProductoActualizar {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
}

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos-admin.component.html',
})
export class ProductosAdminComponent implements OnInit {
  private readonly productosService = inject(ProductosService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly fb = inject(FormBuilder);

  // Signals
  productos = signal<any[]>([]);
  productosFiltrados = signal<any[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  
  // Modal states
  mostrarModalCrear = signal(false);
  mostrarModalEditar = signal(false);
  mostrarModalStock = signal(false);
  mostrarModalImagen = signal(false);
  
  // Forms
  productoForm!: FormGroup;
  editarForm!: FormGroup;
  stockForm!: FormGroup;
  
  // Selected product
  productoSeleccionado: any = null;
  
  // Image upload
  archivoImagen: File | null = null;
  previsualizacionImagen: string | null = null;

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatos();
  }

  // ==================== INICIALIZACIÓN ====================
  
  private inicializarFormularios(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      refrigerado: [false],
      idCategoria: [null, Validators.required]
    });

    this.editarForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.stockForm = this.fb.group({
      stock: [0, [Validators.required, Validators.min(1)]],
      tipoActualizacion: [true] // true = incrementar, false = decrementar
    });
  }

  private cargarDatos(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  // ==================== CARGAR DATOS ====================
  
  cargarProductos(): void {
    this.loading.set(true);
    this.productosService.getProductos().subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.productos.set(response.data.content);
          this.productosFiltrados.set(response.data.content);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading.set(false);
        this.mostrarError('Error al cargar productos');
      }
    });
  }

  private cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (response) => {
        if (response.success) {
          this.categorias.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  // ==================== FILTRADO Y BÚSQUEDA ====================
  
  filtrarProductos(termino: string): void {
    const term = termino.toLowerCase().trim();
    if (!term) {
      this.productosFiltrados.set(this.productos());
      return;
    }
    
    const filtrados = this.productos().filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      p.nombreCategoria?.toLowerCase().includes(term)
    );
    this.productosFiltrados.set(filtrados);
  }

  filtrarPorCategoria(idCategoria: number | null): void {
    if (!idCategoria) {
      this.productosFiltrados.set(this.productos());
      return;
    }
    
    const filtrados = this.productos().filter(p => p.idCategoria === idCategoria);
    this.productosFiltrados.set(filtrados);
  }

  // ==================== CREAR PRODUCTO ====================
  
  abrirModalCrear(): void {
    this.productoForm.reset({
      refrigerado: false,
      stockActual: 0,
      precioUnitario: 0
    });
    this.mostrarModalCrear.set(true);
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear.set(false);
    this.productoForm.reset();
  }

  crearProducto(): void {
    if (this.productoForm.invalid) {
      this.marcarCamposComoTocados(this.productoForm);
      this.mostrarError('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading.set(true);
    const productoData: ProductoForm = this.productoForm.value;

    this.productosService.crearProducto(productoData).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Producto creado exitosamente');
          this.cerrarModalCrear();
          this.cargarProductos();
        } else {
          this.mostrarError(response.message || 'Error al crear producto');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.mostrarError('Error al crear producto');
        this.loading.set(false);
      }
    });
  }

  // ==================== EDITAR PRODUCTO ====================
  
  abrirModalEditar(producto: any): void {
    this.productoSeleccionado = producto;
    this.editarForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precioUnitario: producto.precio
    });
    this.mostrarModalEditar.set(true);
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar.set(false);
    this.productoSeleccionado = null;
    this.editarForm.reset();
  }

  actualizarProducto(): void {
    if (this.editarForm.invalid) {
      this.marcarCamposComoTocados(this.editarForm);
      this.mostrarError('Por favor complete todos los campos requeridos');
      return;
    }

    if (!this.productoSeleccionado) return;

    this.loading.set(true);
    const datosActualizar: ProductoActualizar = this.editarForm.value;

    this.productosService.actualizarProducto(this.productoSeleccionado.idProducto, datosActualizar).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Producto actualizado exitosamente');
          this.cerrarModalEditar();
          this.cargarProductos();
        } else {
          this.mostrarError(response.message || 'Error al actualizar producto');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.mostrarError('Error al actualizar producto');
        this.loading.set(false);
      }
    });
  }

  // ==================== CAMBIAR ESTADO ====================
  
  cambiarEstadoProducto(id: number, nombreProducto: string): void {
    if (!confirm(`¿Desea cambiar el estado del producto "${nombreProducto}"?`)) {
      return;
    }

    this.loading.set(true);
    this.productosService.cambiarEstadoProducto(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Estado del producto actualizado');
          this.cargarProductos();
        } else {
          this.mostrarError(response.message || 'Error al cambiar estado');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
        this.mostrarError('Error al cambiar estado del producto');
        this.loading.set(false);
      }
    });
  }

  // ==================== GESTIÓN DE STOCK ====================
  
  abrirModalStock(producto: any): void {
    this.productoSeleccionado = producto;
    this.stockForm.reset({
      stock: 1,
      tipoActualizacion: true
    });
    this.mostrarModalStock.set(true);
  }

  cerrarModalStock(): void {
    this.mostrarModalStock.set(false);
    this.productoSeleccionado = null;
    this.stockForm.reset();
  }

  actualizarStock(): void {
    if (this.stockForm.invalid) {
      this.marcarCamposComoTocados(this.stockForm);
      this.mostrarError('Por favor ingrese una cantidad válida');
      return;
    }

    if (!this.productoSeleccionado) return;

    this.loading.set(true);
    const datosStock = {
      stock: this.stockForm.value.stock,
      tipoActualizacion: this.stockForm.value.tipoActualizacion
    };

    this.productosService.actualizarStock(this.productoSeleccionado.idProducto, datosStock).subscribe({
      next: (response) => {
        if (response.success) {
          const operacion = datosStock.tipoActualizacion ? 'incrementado' : 'decrementado';
          this.mostrarExito(`Stock ${operacion} exitosamente`);
          this.cerrarModalStock();
          this.cargarProductos();
        } else {
          this.mostrarError(response.message || 'Error al actualizar stock');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        this.mostrarError('Error al actualizar stock');
        this.loading.set(false);
      }
    });
  }

  // ==================== GESTIÓN DE IMÁGENES ====================
  
  abrirModalImagen(producto: any): void {
    this.productoSeleccionado = producto;
    this.archivoImagen = null;
    this.previsualizacionImagen = null;
    this.mostrarModalImagen.set(true);
  }

  cerrarModalImagen(): void {
    this.mostrarModalImagen.set(false);
    this.productoSeleccionado = null;
    this.archivoImagen = null;
    this.previsualizacionImagen = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.mostrarError('Por favor seleccione una imagen válida');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarError('La imagen no debe superar los 5MB');
        return;
      }
      
      this.archivoImagen = file;
      
      // Crear previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previsualizacionImagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  subirImagen(): void {
    if (!this.archivoImagen || !this.productoSeleccionado) {
      this.mostrarError('Por favor seleccione una imagen');
      return;
    }

    this.loading.set(true);
    this.productosService.subirImagenProducto(this.productoSeleccionado.idProducto, this.archivoImagen).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Imagen subida exitosamente');
          this.cerrarModalImagen();
          this.cargarProductos();
        } else {
          this.mostrarError(response.message || 'Error al subir imagen');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        this.mostrarError('Error al subir imagen');
        this.loading.set(false);
      }
    });
  }

  // ==================== UTILIDADES ====================
  
  private marcarCamposComoTocados(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias().find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  }

  getEstadoClase(activo: boolean): string {
    return activo 
      ? 'bg-emerald-100 text-emerald-700' 
      : 'bg-rose-100 text-rose-700';
  }

  getEstadoTexto(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  getStockClase(cantidad: number): string {
    if (cantidad === 0) return 'bg-rose-100 text-rose-700';
    if (cantidad <= 10) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }

  getStockTexto(cantidad: number): string {
    if (cantidad === 0) return 'Agotado';
    if (cantidad <= 10) return 'Stock bajo';
    return 'En stock';
  }

  // ==================== MENSAJES ====================
  
  private mostrarExito(mensaje: string): void {
    alert(mensaje); // Usar toastr, snackbar o similar en producción
  }

  private mostrarError(mensaje: string): void {
    alert(mensaje); // Usar toastr, snackbar o similar en producción
  }
}