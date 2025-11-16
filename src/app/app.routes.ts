import {Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";

export const routes: Routes = [
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
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
    ],
  },
  {path: '**', redirectTo: 'inicio', pathMatch: 'full'},
];
