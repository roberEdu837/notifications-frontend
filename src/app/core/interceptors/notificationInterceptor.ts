import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { NotificationService } from '../services/notification.service';
import { ContextService } from '../services/context.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('/messages')) {
        return next(req);
    }

    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
        return next(req);
    }

    const toastService = inject(ToastService);
    const notificationService = inject(NotificationService);
    const contextService = inject(ContextService);


    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                const context = contextService.getCurrentContext();

                const payload = {
                    ...context,
                    name: "Éxito"
                };

                if (payload.companyId !== 0) {
                    notificationService.getNotificationByInfo(payload).subscribe({
                        next: (res: any) => {
                            toastService.triggerAlert({
                                color: res.color,
                                name: res.message,
                                allowClose: res.allowClose || null,
                                durationSeconds: res.displayDuration || 5
                            });
                        }
                    });
                } else {

                }
            }
        }),
        catchError((error: HttpErrorResponse) => {

            const errorName = error.status === 409 ? 'Precaución/Advertencia' : 'Error';
            const context = contextService.getCurrentContext();

            const payload = {
                ...context,
                name: errorName
            };

            if (payload.companyId !== 0) {
                notificationService.getNotificationByInfo(payload).subscribe({
                    next: (res: any) => {
                        toastService.triggerAlert({
                            color: res.color,
                            name: res.message,
                            allowClose: res.allowClose || null,
                            durationSeconds: res.displayDuration || 5
                        });
                    },
                    error: () => {
                    }
                });
            }

            return throwError(() => error);

        })
    );
};