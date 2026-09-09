import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { NotificationService } from '../services/notification.service';
import { ContextService } from '../services/context.service';
import { AuthService } from '../services/auth.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('/messages') || !['POST', 'PUT', 'PATCH', 'GET'].includes(req.method)) {
        return next(req);
    }

    const toastService = inject(ToastService);
    const notificationService = inject(NotificationService);
    const contextService = inject(ContextService);
    const authService = inject(AuthService);

    const handleDynamicNotification = (name: string) => {
        const context = contextService.getCurrentContext();
        const payload = { ...context, name };

        if (payload.companyId !== 0) {
            notificationService.getNotificationByInfo(payload).subscribe({
                next: (res: any) => {
                    if (res) {
                        if (!['GET'].includes(req.method)) {
                            toastService.triggerAlert({
                                color: res.color,
                                name: res.message,
                                allowClose: res.allowClose || null,
                                durationSeconds: res.displayDuration || 5
                            });
                        }

                    }
                }
            });
        }
    };


    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                handleDynamicNotification("Éxito");
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                toastService.triggerAlert({
                    color: 'danger',
                    name: 'Sesión expirada. Serás redirigido al login.',
                    allowClose: false,
                    durationSeconds: 15
                });

                authService.logout();


                return throwError(() => error);
            }

            const errorName = error.status === 409 ? 'Precaución/Advertencia' : 'Error';
            handleDynamicNotification(errorName);

            return throwError(() => error);
        })
    );
};