import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();
  let cloned = req;

  cloned = req.clone({
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
  ) as unknown as Observable<HttpEvent<any>>;
};