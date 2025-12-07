import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (requiredRoles && !authService.hasRole(requiredRoles)) {
    router.navigate(['/acceso-denegado']);
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }

  if (!authService.isAdminOrTrabajador()) {
    router.navigate(['/acceso-denegado']);
    return false;
  }

  return true;
};
