import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/components/auth/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {


  const authService = inject(AuthService);

  const router = inject(Router);


  const isLoggedIn = await authService.isLoggedin();


  if (isLoggedIn) {

    return true;

  }


  return router.createUrlTree(['/login']);

};