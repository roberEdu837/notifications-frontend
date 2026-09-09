import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { NotificationService } from '../services/notification.service';
import { ContextService } from '../services/context.service';
import { AuthService } from '../services/auth.service';
import { getCustomMappedConfig } from '../constants/simulator-configs';
import { AlertJson, NotificationTypeName } from '../models/notification.model';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('/messages') ||req.url.includes('/auth') ||  !['POST', 'PUT', 'PATCH'].includes(req.method)) {
        return next(req);
    }

    const toastService = inject(ToastService);
    const notificationService = inject(NotificationService);
    const contextService = inject(ContextService);
    const authService = inject(AuthService);

    const handleDynamicNotification = (name: NotificationTypeName) => {
        const context = contextService.getCurrentContext();
        const payload = { ...context, name };

        if (payload.companyId !== 0) {
            notificationService.getNotificationByInfo(payload).subscribe({
                next: (res: AlertJson) => {

                    if (res) { toastService.triggerAlert(res) }
                }, error() {
                    const config = getCustomMappedConfig(name);
                    if (config) { toastService.triggerAlert(config); }
                }
            });
        } else {
            const config = getCustomMappedConfig(name);
            if (config) { toastService.triggerAlert(config); }
        }
    };


    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                handleDynamicNotification(NotificationTypeName.EXITO);
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                const config = getCustomMappedConfig(NotificationTypeName.RELOGIN);
                if (config) { toastService.triggerAlert(config); }

                authService.logout();

                return throwError(() => error);
            }

            const errorName = error.status === 409 ? NotificationTypeName.PRECAUCION : NotificationTypeName.ERROR;
            handleDynamicNotification(errorName);

            return throwError(() => error);
        })
    );
};