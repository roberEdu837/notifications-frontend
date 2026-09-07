import { Injectable, RendererFactory2, Service, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { filter } from 'rxjs';

export interface AlertaJson {
    name: string;
    color: 'success' | 'danger' | 'warning' | 'info';
    durationSeconds?: number;
    allowClose?: boolean;
}

@Service()
export class ToastService {
    private toastr = inject(ToastrService);
    private router = inject(Router);
    private activeToastId?: number;
    private rendererFactory = inject(RendererFactory2);
    constructor() {

        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe(() => {
            this.clearActive();
        });

        const renderer = this.rendererFactory.createRenderer(null, null);
        renderer.listen('document', 'click', (event: Event) => {
            if (this.activeToastId !== undefined) {
                this.clearActive();
            }
        });
    }

    triggerAlert(info: AlertaJson) {
        this.clearActive();

        let timeout = info.durationSeconds !== undefined ? info.durationSeconds * 1000 : undefined;
        let closeBtn = info.allowClose ?? false;

        const opciones: Partial<IndividualConfig> = {
            timeOut: timeout,
            extendedTimeOut: timeout === 0 ? 1000 : 1000,
            closeButton: closeBtn,
            disableTimeOut: timeout === 0
        };

        let toastRef;
        switch (info.color) {
            case 'success':
                toastRef = this.toastr.success(info.name, 'Éxito', opciones);
                break;
            case 'danger':
                toastRef = this.toastr.error(info.name, 'Error', opciones);
                break;
            case 'warning':
                toastRef = this.toastr.warning(info.name, 'Precaución', opciones);
                break;
            default:
                toastRef = this.toastr.info(info.name, 'Información', opciones);
                break;
        }

        if (toastRef) {
            this.activeToastId = toastRef.toastId;
        }
    }


    clearActive() {
        if (this.activeToastId !== undefined) {
            this.toastr.clear(this.activeToastId);
            this.activeToastId = undefined;
        }
    }
}