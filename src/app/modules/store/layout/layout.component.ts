import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {LucideAngularModule, MapPin, Search, ShoppingBasket, Sparkles} from "lucide-angular";

@Component({
  selector: 'page-layout',
  templateUrl: './layout.component.html',
  imports :[RouterOutlet, LucideAngularModule]
})
export class LayoutComponent {

  public cartIcon = ShoppingBasket
  public localIcon = MapPin
  public promoIcon = Sparkles
  public searchIcon = Search

}