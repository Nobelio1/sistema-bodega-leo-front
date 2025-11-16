import {CommonModule, NgClass} from '@angular/common';
import {Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CategoryCard, FeaturedProduct, HeroHighlight, Testimonial} from './interfaces/inicio.interface';
import {PromoBannerComponent} from './componentes/promo-banner/promo-banner.component';

@Component({
  selector: 'page-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgClass,
    PromoBannerComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  protected readonly heroHighlight = signal<HeroHighlight | null>(null);
  protected readonly categories = signal<CategoryCard[]>([]);
  protected readonly featuredProducts = signal<FeaturedProduct[]>([]);
  protected readonly testimonials = signal<Testimonial[]>([]);
  protected readonly stockedTips = signal<string[]>([]);
  protected readonly starScale: ReadonlyArray<number> = [1, 2, 3, 4, 5];

  protected readonly inventoryPulse = computed(() => {
    const featured = this.featuredProducts();
    if (!featured.length) {
      return 'Validamos el inventario en tiempo real para ti.';
    }
    const lowStock = featured.filter((item) => item.stock <= 10).length;
    if (!lowStock) {
      return 'Todo listo para tu despensa hoy mismo.';
    }
    return `${lowStock} productos con stock limitado: ¡aprovéchalos!`;
  });

  constructor() {
    this.prefetchHomeContent();
  }

  protected productStatus(product: FeaturedProduct): string {
    if (product.stock <= 5) {
      return 'Últimas unidades';
    }
    if (product.stock <= 12) {
      return 'Stock en descenso';
    }
    return 'Listo para envío inmediato';
  }

  private prefetchHomeContent(): void {
    this.heroHighlight.set({
      badge: 'Entregas en menos de 2h',
      title: 'Abarrotes y básicos para el hogar sin salir de casa',
      subtitle: 'Desde tu despensa semanal hasta los caprichos de última hora. Compra seguro y recibe fresco.',
      primaryCta: {label: 'Explorar productos', route: '/productos'},
      secondaryCta: {label: 'Ver promociones', route: '/promociones'},
      advantages: ['Pagos seguros', 'Seguimiento en vivo', 'Precios directos de la bodega']
    });

    this.categories.set([
      {
        id: 'despensa',
        name: 'Abarrotes',
        description: 'Granos, cereales y conservas',
        icon: '🧺',
        accent: 'from-orange-400 to-orange-500'
      },
      {
        id: 'limpieza',
        name: 'Limpieza',
        description: 'Detergentes y multiusos',
        icon: '🧽',
        accent: 'from-emerald-500 to-emerald-600'
      },
      {
        id: 'frescos',
        name: 'Frescos',
        description: 'Frutas, verduras y lácteos',
        icon: '🥬',
        accent: 'from-lime-400 to-lime-500'
      },
      {
        id: 'bebidas',
        name: 'Bebidas',
        description: 'Jugos, cafés y más',
        icon: '🥤',
        accent: 'from-orange-300 to-amber-400'
      }
    ]);

    this.featuredProducts.set([
      {
        id: 1,
        name: 'Canasta semanal básica',
        description: 'Arroz, aceite, azúcar, pasta y legumbres seleccionadas.',
        badge: 'nuevo',
        price: 129.9,
        unit: 'paquete',
        stock: 8,
        category: 'Abarrotes'
      },
      {
        id: 2,
        name: 'Kit limpieza profunda',
        description: 'Detergente líquido, desinfectante cítrico y fibras biodegradables.',
        badge: 'top ventas',
        price: 92.5,
        unit: 'set',
        stock: 15,
        category: 'Limpieza'
      },
      {
        id: 3,
        name: 'Frutas listas para snack',
        description: 'Manzana gala, plátano y mix de berries para la semana.',
        badge: 'fresco',
        price: 74.0,
        unit: 'combo',
        stock: 5,
        category: 'Frescos'
      }
    ]);

    this.testimonials.set([
      {
        id: 1,
        author: 'Miriam V.',
        detail: 'Recibo siempre a tiempo y en perfecto estado. El servicio me ahorra ir al súper.',
        rating: 5,
        orderFrequency: 'Compra cada 10 días'
      },
      {
        id: 2,
        author: 'Sergio L.',
        detail: 'Las ofertas de limpieza sí valen la pena y el reparto es muy amable.',
        rating: 4,
        orderFrequency: 'Compra semanal'
      }
    ]);

    this.stockedTips.set([
      'Combina compras programadas con envíos express para nunca quedarte sin básicos.',
      'Aprovecha los kits armados: ahorras hasta un 12% frente a productos sueltos.',
      'Guarda tus direcciones frecuentes para despachos más rápidos.'
    ]);
  }
}
