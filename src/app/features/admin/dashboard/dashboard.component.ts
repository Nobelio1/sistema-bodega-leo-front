import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface EstadisticasGenerales {
  totalPedidosHoy: number;
  ventasHoy: number;
  pedidosPendientes: number;
  productosConBajoStock: number;
}

interface PedidoReciente {
  idPedido: number;
  codigoRecojo: string;
  nombreCliente: string;
  montoTotal: number;
  estadoPedido: string;
  fechaPedido: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-5xl">📊</div>
            <div class="text-right">
              <p class="text-sm opacity-90">Pedidos Hoy</p>
              <p class="text-4xl font-bold">{{ estadisticas()?.totalPedidosHoy || 0 }}</p>
            </div>
          </div>
          <div class="text-sm opacity-75">Pedidos realizados hoy</div>
        </div>

        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-5xl">💰</div>
            <div class="text-right">
              <p class="text-sm opacity-90">Ventas Hoy</p>
              <p class="text-4xl font-bold">S/ {{ estadisticas()?.ventasHoy || 0 }}</p>
            </div>
          </div>
          <div class="text-sm opacity-75">Ingresos del día</div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-5xl">⏳</div>
            <div class="text-right">
              <p class="text-sm opacity-90">Pendientes</p>
              <p class="text-4xl font-bold">{{ estadisticas()?.pedidosPendientes || 0 }}</p>
            </div>
          </div>
          <div class="text-sm opacity-75">Pedidos por procesar</div>
        </div>

        <div class="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-5xl">⚠️</div>
            <div class="text-right">
              <p class="text-sm opacity-90">Bajo Stock</p>
              <p class="text-4xl font-bold">{{ estadisticas()?.productosConBajoStock || 0 }}</p>
            </div>
          </div>
          <div class="text-sm opacity-75">Productos a reponer</div>
        </div>
      </div>

      <!-- Pedidos Recientes -->
      <div class="bg-white rounded-3xl shadow-lg p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-stone-900">Pedidos Recientes</h2>
            <p class="text-sm text-stone-600">Últimos pedidos registrados</p>
          </div>
          <a [routerLink]="['/admin/pedidos']" class="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Ver todos →
          </a>
        </div>

        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="animate-pulse bg-stone-100 rounded-2xl h-20"></div>
            }
          </div>
        } @else if (pedidosRecientes().length > 0) {
          <div class="space-y-4">
            @for (pedido of pedidosRecientes(); track pedido.idPedido) {
              <div class="flex items-center justify-between p-4 rounded-2xl border-2 border-stone-100 hover:border-orange-300 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <span class="text-xl">🛍️</span>
                  </div>
                  <div>
                    <p class="font-semibold text-stone-900">{{ pedido.nombreCliente }}</p>
                    <p class="text-sm text-stone-600">Código: {{ pedido.codigoRecojo }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-stone-900">S/ {{ pedido.montoTotal | number: '1.0-2' }}</p>
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="getEstadoClass(pedido.estadoPedido)">
                    {{ pedido.estadoPedido }}
                  </span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12">
            <p class="text-stone-500">No hay pedidos recientes</p>
          </div>
        }
      </div>

      <!-- Acciones Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a [routerLink]="['/admin/productos']"
           class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-300">
          <div class="text-5xl mb-4">📦</div>
          <h3 class="text-xl font-bold text-stone-900 mb-2">Gestionar Productos</h3>
          <p class="text-sm text-stone-600">Agregar, editar o actualizar stock</p>
        </a>

        <a [routerLink]="['/admin/pedidos']"
           class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-emerald-300">
          <div class="text-5xl mb-4">🛍️</div>
          <h3 class="text-xl font-bold text-stone-900 mb-2">Ver Pedidos</h3>
          <p class="text-sm text-stone-600">Procesar y gestionar pedidos</p>
        </a>

        <a [routerLink]="['/admin/comprobantes']"
           class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-300">
          <div class="text-5xl mb-4">🧾</div>
          <h3 class="text-xl font-bold text-stone-900 mb-2">Comprobantes</h3>
          <p class="text-sm text-stone-600">Generar boletas y facturas</p>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  estadisticas = signal<EstadisticasGenerales | null>(null);
  pedidosRecientes = signal<PedidoReciente[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarPedidosRecientes();
  }

  private cargarEstadisticas(): void {
    // Simulación - en producción conectar con endpoints reales
    setTimeout(() => {
      this.estadisticas.set({
        totalPedidosHoy: 15,
        ventasHoy: 1250.50,
        pedidosPendientes: 8,
        productosConBajoStock: 3
      });
    }, 500);
  }

  private cargarPedidosRecientes(): void {
    this.http.get<any>(`${environment.apiUrl}/pedido?pagina=0&limite=5`).subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.pedidosRecientes.set(response.data.content);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-amber-100 text-amber-700',
      'PROCESANDO': 'bg-blue-100 text-blue-700',
      'ENTREGADO': 'bg-emerald-100 text-emerald-700',
      'CANCELADO': 'bg-rose-100 text-rose-700'
    };
    return classes[estado] || 'bg-stone-100 text-stone-700';
  }
}
