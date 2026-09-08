import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { NotificationService } from '../services/notification.service';
import { NotificationResponse } from '../models/notification.model';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('/messages/configuration')) {
        return next(req);
    }

    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
        return next(req);
    }

    const toastService = inject(ToastService);
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                console.log(event)

                const payload = {
                    systemId: 3,
                    companyId: 3,
                    countryId: 3,
                    name: "Éxito"
                };

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
            }
        }),
        catchError((error: HttpErrorResponse) => {

            const errorName = error.status === 409 ? 'Precaución/Advertencia' : 'Error';

            const payload = {
                systemId: 3,
                companyId: 3,
                countryId: 3,
                name: errorName
            };

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

            return throwError(() => error);
        })
    );
};