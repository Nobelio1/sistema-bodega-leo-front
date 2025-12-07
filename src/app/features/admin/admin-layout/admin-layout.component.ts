import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink ],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;
  currentRoute = signal('');

  private allMenuItems: MenuItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/productos', label: 'Productos', icon: '📦', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/categorias', label: 'Categorías', icon: '🏷️', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '🛍️', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/clientes', label: 'Clientes', icon: '👥', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/pagos', label: 'Pagos', icon: '💳', roles: ['ADMIN', 'TRABAJADOR'] },
    { path: '/admin/comprobantes', label: 'Comprobantes', icon: '🧾', roles: ['ADMIN', 'TRABAJADOR'] }
  ];

  menuItems = computed(() => {
    const userRole = this.currentUser()?.rol;
    if (!userRole) return [];
    return this.allMenuItems.filter(item => item.roles.includes(userRole));
  });

  pageTitle = computed(() => {
    const route = this.currentRoute();
    if (route.includes('dashboard')) return 'Dashboard';
    if (route.includes('productos')) return 'Gestión de Productos';
    if (route.includes('categorias')) return 'Gestión de Categorías';
    if (route.includes('pedidos')) return 'Gestión de Pedidos';
    if (route.includes('clientes')) return 'Gestión de Clientes';
    if (route.includes('pagos')) return 'Gestión de Pagos';
    if (route.includes('comprobantes')) return 'Gestión de Comprobantes';
    return 'Panel de Administración';
  });

  pageSubtitle = computed(() => {
    const route = this.currentRoute();
    if (route.includes('dashboard')) return 'Resumen general del sistema';
    if (route.includes('productos')) return 'Administra el catálogo de productos';
    if (route.includes('categorias')) return 'Organiza tus categorías';
    if (route.includes('pedidos')) return 'Visualiza y gestiona todos los pedidos';
    if (route.includes('clientes')) return 'Información de clientes registrados';
    if (route.includes('pagos')) return 'Control de transacciones';
    if (route.includes('comprobantes')) return 'Boletas y facturas emitidas';
    return 'Bienvenido al panel de administración';
  });

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
