import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprobanteService } from '../../../core/services/comprobante.service';

@Component({
  selector: 'app-comprobantes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-stone-900">Gestión de Comprobantes</h2>
        <p class="text-sm text-stone-600">Boletas y facturas emitidas</p>
      </div>

      <!-- Generar comprobante -->
      <div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-300">
        <h3 class="text-xl font-bold text-stone-900 mb-4">Generar Comprobante</h3>
        <form (submit)="generarComprobante()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">ID Pedido</label>
              <input type="number" [(ngModel)]="formularioComprobante.idPedido" name="idPedido"
                     class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:outline-none"
                     placeholder="ID del pedido" required/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Tipo</label>
              <select [(ngModel)]="formularioComprobante.tipoComprobante" name="tipo"
                      class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:outline-none" required>
                <option value="BOLETA">Boleta</option>
                <option value="FACTURA">Factura</option>
              </select>
            </div>
          </div>

          @if (formularioComprobante.tipoComprobante === 'FACTURA') {
            <div class="p-4 bg-blue-50 rounded-xl space-y-4">
              <h4 class="font-semibold text-blue-900">Datos para Factura</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="formularioComprobante.datosFactura.ruc" name="ruc"
                       placeholder="RUC (11 dígitos)" maxlength="11"
                       class="px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none" required/>
                <input type="text" [(ngModel)]="formularioComprobante.datosFactura.razonSocial" name="razonSocial"
                       placeholder="Razón Social"
                       class="px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none" required/>
              </div>
              <input type="text" [(ngModel)]="formularioComprobante.datosFactura.direccionFiscal" name="direccionFiscal"
                     placeholder="Dirección Fiscal"
                     class="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none" required/>
            </div>
          }

          <button type="submit"
                  class="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">
            Generar Comprobante
          </button>
        </form>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex gap-3">
          <button (click)="filtroTipo.set('TODOS')"
                  [class]="filtroTipo() === 'TODOS' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'"
                  class="px-4 py-2 rounded-xl font-semibold">
            Todos
          </button>
          <button (click)="filtroTipo.set('BOLETA')"
                  [class]="filtroTipo() === 'BOLETA' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'"
                  class="px-4 py-2 rounded-xl font-semibold">
            Boletas
          </button>
          <button (click)="filtroTipo.set('FACTURA')"
                  [class]="filtroTipo() === 'FACTURA' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'"
                  class="px-4 py-2 rounded-xl font-semibold">
            Facturas
          </button>
        </div>
      </div>

      <!-- Lista de comprobantes -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        @if (loading()) {
          <div class="p-8">
            <div class="animate-pulse space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="h-16 bg-stone-100 rounded"></div>
              }
            </div>
          </div>
        } @else {
          <table class="w-full">
            <thead class="bg-stone-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Número</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Tipo</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Cliente</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Monto</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Fecha</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-stone-100 text-center">
                <td colspan="6" class="px-6 py-8 text-stone-500">
                  Busca un pedido para generar su comprobante
                </td>
              </tr>
            </tbody>
          </table>
        }
      </div>
    </div>
  `
})
export class ComprobantesAdminComponent implements OnInit {
  private readonly comprobanteService = inject(ComprobanteService);

  loading = signal(false);
  filtroTipo = signal('TODOS');

  formularioComprobante = {
    idPedido: 0,
    tipoComprobante: 'BOLETA' as 'BOLETA' | 'FACTURA',
    datosFactura: {
      ruc: '',
      razonSocial: '',
      direccionFiscal: ''
    }
  };

  ngOnInit(): void {
    // Inicialización
  }

  generarComprobante(): void {
    const datos = this.formularioComprobante.tipoComprobante === 'FACTURA'
      ? this.formularioComprobante
      : { idPedido: this.formularioComprobante.idPedido, tipoComprobante: this.formularioComprobante.tipoComprobante };

    this.comprobanteService.generarComprobante(datos).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Comprobante generado: ' + response.data.numero);
          this.resetFormulario();
        }
      },
      error: () => alert('Error al generar comprobante')
    });
  }

  resetFormulario(): void {
    this.formularioComprobante = {
      idPedido: 0,
      tipoComprobante: 'BOLETA',
      datosFactura: { ruc: '', razonSocial: '', direccionFiscal: '' }
    };
  }
}
