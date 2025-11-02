import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // CRÍTICO: withCredentials debe ser true para que funcione Sanctum
  const cloned = req.clone({
    withCredentials: true,
    setHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  return next(cloned).pipe(
    tap({
      error: (err: any) => {
        if (err && err.status === 401) {
          auth.removeToken();
          router.navigate(['/login']);
        }
      }
    })
  ) as Observable<HttpEvent<any>>;
};