import { CanActivateFn } from '@angular/router';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  return true;
};
