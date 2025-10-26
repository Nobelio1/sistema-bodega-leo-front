import { Routes } from '@angular/router';
import {LayoutComponent} from "./modules/store/layout/layout.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'productos',
        loadComponent: () => import('./modules/store/pages/productos/productos.component').then(m => m.ProductosComponent),
        title: 'Productos'
      }
    ]
  }
];
