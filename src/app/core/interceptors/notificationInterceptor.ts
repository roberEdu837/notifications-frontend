import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        
        console.log(event)
      }
    }),
    catchError((error: HttpErrorResponse) => {
    
      return throwError(() => error);
    })
  );
};