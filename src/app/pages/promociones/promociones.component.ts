import {CommonModule} from '@angular/common';
import {Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

interface PromoCard {
  id: number;
  title: string;
  description: string;
  tag: string;
  discount: number;
  price: number;
  beforePrice?: number;
  expiresLabel: string;
  stockStatus: 'alto' | 'medio' | 'bajo';
}

interface BenefitCard {
  id: number;
  title: string;
  detail: string;
  icon: string;
  highlight: string;
}

@Component({
  selector: 'page-promociones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})
export class PromocionesComponent {
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly activePromos = signal<PromoCard[]>([]);
  protected readonly comboDeals = signal<PromoCard[]>([]);
  protected readonly vipBenefits = signal<BenefitCard[]>([]);
  protected readonly statusMessage = computed(() => {
    if (this.hasError()) {
      return 'Ocurrió un problema al cargar tus promociones.';
    }
    if (this.isLoading()) {
      return 'Estamos preparando las mejores ofertas para ti.';
    }
    if (!this.activePromos().length && !this.comboDeals().length) {
      return 'Vuelve pronto: estamos renovando nuestras promociones para ti.';
    }
    return 'Promociones personalizadas basadas en compras recientes.';
  });

  constructor() {
    this.loadPromotions();
  }

  protected reload(): void {
    this.loadPromotions();
  }

  private loadPromotions(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    queueMicrotask(() => {
      try {
        this.activePromos.set([
          {
            id: 1,
            title: 'Descuento 25% en básicos de despensa',
            description: 'Arroz, azúcar, aceite y conservas seleccionadas.',
            tag: 'Entrega hoy',
            discount: 25,
            price: 89.9,
            beforePrice: 119.9,
            expiresLabel: 'Finaliza en 2 días',
            stockStatus: 'alto'
          },
          {
            id: 2,
            title: '2x1 en detergentes premium',
            description: 'Incluye fragancias cítricas y formato familiar.',
            tag: 'Solo online',
            discount: 50,
            price: 64.5,
            beforePrice: 129.0,
            expiresLabel: 'Hasta agotar stock',
            stockStatus: 'medio'
          }
        ]);

        this.comboDeals.set([
          {
            id: 3,
            title: 'Combo limpieza profunda',
            description: 'Desinfectante cítrico + paños reutilizables + guantes.',
            tag: 'Envío express',
            discount: 18,
            price: 74.0,
            beforePrice: 92.0,
            expiresLabel: 'Válido este fin de semana',
            stockStatus: 'medio'
          },
          {
            id: 4,
            title: 'Canasta fresca familiar',
            description: 'Frutas y verduras para una semana de snacks saludables.',
            tag: 'Cadena de frío',
            discount: 15,
            price: 98.5,
            expiresLabel: 'Reposición diaria',
            stockStatus: 'bajo'
          }
        ]);

        this.vipBenefits.set([
          {
            id: 1,
            title: 'Entrega preferente',
            detail: 'Agendas la hora exacta y recibes seguimiento en vivo.',
            icon: '⚡',
            highlight: 'Disponible para membresía Hogar+'
          },
          {
            id: 2,
            title: 'Precios exclusivos',
            detail: 'Acceso anticipado a combos y kits antes del público general.',
            icon: '💳',
            highlight: 'Ahorra hasta 18% adicional'
          },
          {
            id: 3,
            title: 'Recompensas por recurrencia',
            detail: 'Acumula puntos por pedidos programados y cámbialos por envíos gratis.',
            icon: '🎁',
            highlight: 'Usuarios con 3 pedidos/mes'
          }
        ]);

        this.isLoading.set(false);
      } catch (error) {
        console.error(error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  protected stockLabel(level: PromoCard['stockStatus']): string {
    switch (level) {
      case 'bajo':
        return 'Últimas unidades';
      case 'medio':
        return 'Stock limitado';
      default:
        return 'Stock disponible';
    }
  }

  protected priceDelta(promo: PromoCard): number | null {
    if (!promo.beforePrice) {
      return null;
    }
    return promo.beforePrice - promo.price;
  }
}
