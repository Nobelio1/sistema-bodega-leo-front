import {Component, ElementRef, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BannerItem} from './interfaces/promo-banner.interface';
import {LucideAngularModule, ChevronRight, ChevronLeft} from 'lucide-angular';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './promo-banner.component.html',
  styles: []
})
export class PromoBannerComponent {
  public flechaIzquierda = ChevronLeft;
  public flechaDerecha = ChevronRight;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  items = signal<BannerItem[]>([
    {
      id: 1,
      type: 'discount',
      title: 'en vinos La Mascota',
      value: '50%',
      image: 'assets/vinos.png'
    },
    {
      id: 2,
      type: 'discount',
      title: 'en whisky y ron',
      value: '35%',
      image: 'assets/whisky.png'
    },
    {
      id: 3,
      type: 'price',
      title: 'Pack espumante Riccadonna',
      subtitle: 'botella 750 ml: Asti + Ruby',
      value: 'S/ 119.90',
      regularPrice: 'S/ 139.90',
      image: 'assets/espumante.png'
    },
    {
      id: 4,
      type: 'discount',
      title: 'en tequilas seleccionados',
      value: '20%',
      image: 'assets/tequila.png'
    }
  ]);

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.firstElementChild.offsetWidth + 20;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}
