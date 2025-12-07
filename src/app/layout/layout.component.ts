import { Component, signal, inject, computed } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { LucideAngularModule, MapPin, Search, ShoppingBasket, Sparkles, User, LogOut } from "lucide-angular";
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

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
  private readonly authService = inject(AuthService);

  public cartIcon = ShoppingBasket;
  public localIcon = MapPin;
  public promoIcon = Sparkles;
  public searchIcon = Search;
  public userIcon = User;
  public logoutIcon = LogOut;

  public isAuthenticated = this.authService.isAuthenticated;
  public currentUser = this.authService.currentUser;
  public isAdmin = computed(() => this.authService.isAdminOrTrabajador());

  public pages = signal([
    {
      id: 1,
      title: 'Inicio',
      route: '/inicio'
    },
    {
      id: 2,
      title: 'Productos',
      route: '/productos'
    },
  ]);

  logout(): void {
    this.authService.logout();
  }
}
