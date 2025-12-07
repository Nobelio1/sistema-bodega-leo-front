import {Component, ElementRef, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {BannerItem} from './interfaces/promo-banner.interface';
import {LucideAngularModule, ChevronRight, ChevronLeft} from 'lucide-angular';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.css'
})
export class PromoBannerComponent {
  public flechaIzquierda = ChevronLeft;
  public flechaDerecha = ChevronRight;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  currentIndex = signal<number>(0);

  items = signal<BannerItem[]>([
    {
      id: 1,
      type: 'discount',
      title: 'Vinos seleccionados',
      value: '50%',
      image: 'assets/vinos.png'
    },
    {
      id: 2,
      type: 'discount',
      title: 'Licores premium',
      value: '35%',
      image: 'assets/whisky.png'
    },
    {
      id: 3,
      type: 'price',
      title: 'Pack espumante Riccadonna',
      subtitle: 'Botella 750ml: Asti + Ruby',
      value: 'S/ 119.90',
      regularPrice: 'S/ 139.90',
      image: 'assets/espumante.png'
    },
    {
      id: 4,
      type: 'discount',
      title: 'Tequilas seleccionados',
      value: '20%',
      image: 'assets/tequila.png'
    }
  ]);

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.firstElementChild.offsetWidth + 24; // 24px gap

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    this.updateCurrentIndex(direction);
  }

  scrollToIndex(index: number) {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = (container.firstElementChild.offsetWidth + 24) * index;

    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });

    this.currentIndex.set(index);
  }

  calculateSavings(regularPrice: string | undefined, offerPrice: string | undefined): string {
    if (!regularPrice || !offerPrice) return '';

    const regular = parseFloat(regularPrice.replace('S/ ', ''));
    const offer = parseFloat(offerPrice.replace('S/ ', ''));
    const savings = regular - offer;

    return `S/ ${savings.toFixed(2)}`;
  }

  private updateCurrentIndex(direction: 'left' | 'right') {
    const current = this.currentIndex();
    const total = this.items().length;

    if (direction === 'left') {
      this.currentIndex.set(current > 0 ? current - 1 : current);
    } else {
      this.currentIndex.set(current < total - 1 ? current + 1 : current);
    }
  }
}
