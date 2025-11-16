import {Component, signal} from "@angular/core";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LucideAngularModule, MapPin, Search, ShoppingBasket, Sparkles} from "lucide-angular";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'lyt-layout',
  templateUrl: './layout.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    LucideAngularModule,
    RouterLinkActive,
    RouterLink
  ]
})
export class LayoutComponent {
  public cartIcon = ShoppingBasket
  public localIcon = MapPin
  public promoIcon = Sparkles
  public searchIcon = Search

  public pages = signal([
    {
      id: 1,
      title: 'Inicio',
      route: '/inicio'
    },
    {
      id: 2,
      title: 'Promociones',
      route: '/promociones'
    },
    {
      id: 3,
      title: 'Productos',
      route: '/productos'
    },
  ])

}
