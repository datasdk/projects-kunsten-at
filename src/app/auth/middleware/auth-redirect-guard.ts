import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authRedirectGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isLoggedin()) {
    return router.parseUrl(await authService.consumeLoginRedirect('/home/dashboard'));
  }

  return true;
};
