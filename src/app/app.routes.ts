import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'promociones',
        loadComponent: () => import('./pages/promociones/promociones.component').then(m => m.PromocionesComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/carrito/carrito.component').then(m => m.CarritoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'mis-pedidos',
        loadComponent: () => import('./pages/mis-pedidos/mis-pedidos.component').then(m => m.MisPedidosComponent),
        canActivate: [authGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },

  // Auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'registro-cliente',
        loadComponent: () => import('./features/auth/registro-cliente/registro-cliente.component').then(m => m.RegistroClienteComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./features/admin/productos/productos-admin.component').then(m => m.ProductosAdminComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/admin/categorias/categorias-admin.component').then(m => m.CategoriasAdminComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/admin/pedidos/pedidos-admin.component').then(m => m.PedidosAdminComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/admin/clientes/clientes-admin.component').then(m => m.ClientesAdminComponent)
      },
      {
        path: 'pagos',
        loadComponent: () => import('./features/admin/pagos/pagos-admin.component').then(m => m.PagosAdminComponent)
      },
      {
        path: 'comprobantes',
        loadComponent: () => import('./features/admin/comprobantes/comprobantes-admin.component').then(m => m.ComprobantesAdminComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Error routes
  {
    path: 'acceso-denegado',
    loadComponent: () => import('./pages/acceso-denegado/acceso-denegado.component').then(m => m.AccesoDenegadoComponent)
  },

  // Wildcard
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
];
