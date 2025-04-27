import { inject, Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const injector = inject(Injector);
  const auth = injector.get(AuthService);
  const router = injector.get(Router);

  if (auth.isLoggedIn()) {
    return true;
  } else {
    alert('Please login first')
    return router.createUrlTree(['/login']);
  }
};
