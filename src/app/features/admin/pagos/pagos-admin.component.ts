import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../core/services/pago.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-stone-900">Gestión de Pagos</h2>
        <p class="text-sm text-stone-600">Control de transacciones y pagos</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white">
          <div class="text-4xl mb-2">✅</div>
          <p class="text-sm opacity-90">Pagos Confirmados</p>
          <p class="text-3xl font-bold">{{ estadisticas().confirmados }}</p>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white">
          <div class="text-4xl mb-2">⏳</div>
          <p class="text-sm opacity-90">Pagos Pendientes</p>
          <p class="text-3xl font-bold">{{ estadisticas().pendientes }}</p>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white">
          <div class="text-4xl mb-2">💰</div>
          <p class="text-sm opacity-90">Total Recaudado</p>
          <p class="text-3xl font-bold">S/ {{ estadisticas().total | number: '1.0-2' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <label class="block text-sm font-semibold text-stone-700 mb-2">
          Buscar pagos por código de pedido
        </label>
        <div class="flex gap-3">
          <input type="text"
                 [(ngModel)]="codigoPedidoBusqueda"
                 placeholder="Ingrese código de recojo del pedido"
                 class="flex-1 px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:outline-none"/>
          <button (click)="buscarPagosPorPedido()"
                  class="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600">
            Buscar
          </button>
        </div>
      </div>

      @if (pagosMostrados().length > 0) {
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-stone-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">ID Pago</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Método</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Monto</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Estado</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Fecha</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (pago of pagosMostrados(); track pago.idPago) {
                <tr class="border-t border-stone-100 hover:bg-stone-50">
                  <td class="px-6 py-4 font-mono text-sm">{{ pago.idPago }}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {{ pago.metodo }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-emerald-600">S/ {{ pago.monto | number: '1.0-2' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold"
                          [class]="getEstadoPagoClass(pago.estadoPago)">
                      {{ pago.estadoPago }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-stone-600">{{ pago.fechaPago }}</td>
                  <td class="px-6 py-4">
                    @if (pago.estadoPago === 'PENDIENTE') {
                      <button (click)="confirmarPago(pago.idPago)"
                              class="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                        Confirmar →
                      </button>
                    } @else {
                      <span class="text-stone-400 text-sm">-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class PagosAdminComponent implements OnInit {
  private readonly pagoService = inject(PagoService);
  private readonly pedidoService = inject(PedidoService);

  pagosMostrados = signal<any[]>([]);
  codigoPedidoBusqueda = '';
  estadisticas = signal({
    confirmados: 0,
    pendientes: 0,
    total: 0
  });

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.estadisticas.set({
      confirmados: 25,
      pendientes: 5,
      total: 12450.50
    });
  }

  buscarPagosPorPedido(): void {
    if (!this.codigoPedidoBusqueda) {
      alert('Ingrese un código de pedido');
      return;
    }

    this.pedidoService.buscarPorCodigoRecojo(this.codigoPedidoBusqueda).subscribe({
      next: (response) => {
        if (response.success) {
          this.pagoService.obtenerPagosPorPedido(response.data.idPedido).subscribe({
            next: (pagosResponse) => {
              if (pagosResponse.success) {
                this.pagosMostrados.set(pagosResponse.data);
              }
            },
            error: () => alert('Error al obtener pagos')
          });
        }
      },
      error: () => alert('Pedido no encontrado')
    });
  }

  confirmarPago(idPago: number): void {
    if (confirm('¿Confirmar este pago?')) {
      this.pagoService.confirmarPago(idPago).subscribe({
        next: () => {
          alert('Pago confirmado');
          this.buscarPagosPorPedido();
        },
        error: () => alert('Error al confirmar pago')
      });
    }
  }

  getEstadoPagoClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-amber-100 text-amber-700',
      'CONFIRMADO': 'bg-emerald-100 text-emerald-700',
      'FALLIDO': 'bg-rose-100 text-rose-700'
    };
    return classes[estado] || 'bg-stone-100 text-stone-700';
  }
}
