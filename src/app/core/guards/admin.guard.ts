import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser$.value;
  if (!user || user.role !== 'admin') {
    router.navigate(['/user/dashboard']);
    return false;
  }
  return true;
};