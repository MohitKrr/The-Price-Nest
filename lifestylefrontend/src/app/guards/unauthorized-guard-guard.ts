import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const unauthorizedGuardGuard: CanActivateFn = (route, state) => {
  // let isLoggedIn = localStorage.getItem('status')
  // if(isLoggedIn==='loggedin')
  //   return true;
  // else
  //   return false;

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']); // Redirect unauthorized users
    return false;
  }

};
