import { Component, inject, signal, input, output, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NotificationService } from "../../../core/services/notification.service";
import { CatalogItem } from "../../../core/models/catalog.model";
import { MessageType } from "../../../core/models/message-types.model";
import { NotificationItem } from "../../../core/models/notification.model";
import { ToastService } from "../../../core/services/toast.service";

@Component({
    selector: 'app-notification-form',
    templateUrl: './notification-form.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class NotificationFormComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly fb = inject(FormBuilder);

    private toastService = inject(ToastService);

    countries = input.required<CatalogItem[]>();
    companies = input.required<CatalogItem[]>();
    systems = input.required<CatalogItem[]>();
    messageTypes = input.required<MessageType[]>();

    loadNotifications = output<void>();
    notificationData = input<NotificationItem | null>();

    constructor() {
        effect(() => {

            const data = this.notificationData();
            if (data) {
                this.notificationForm.patchValue(data);
            } else {
                this.notificationForm.reset({
                    companyId: '',
                    countryId: '',
                    systemId: '',
                    messageTypeId: '',
                    message: '',
                    status: 'A',
                    displayDuration: 0
                });
            }

        });
    }

    isLoadingForm = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    errorMessage = signal<string>('');

    notificationForm: FormGroup = this.fb.group({
        companyId: ['', [Validators.required]],
        countryId: ['', [Validators.required]],
        systemId: ['', [Validators.required]],
        messageTypeId: ['', [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        displayDuration: [0, []],
        status: ['A', [Validators.required]]
    });

    onSubmit(): void {
        if (this.notificationForm.invalid) {
            this.notificationForm.markAllAsTouched();
            return;
        }

        this.isLoadingForm.set(true);
        this.isSubmitting.set(true);
        this.errorMessage.set('');

        const formValues = this.notificationForm.getRawValue();
        const currentData = this.notificationData();

        const request$ = currentData
            ? this.notificationService.updateNotification(currentData.folio, formValues)
            : this.notificationService.createNotification(formValues);


        request$.subscribe({
            next: (data) => {
                console.log(data)
                this.isSubmitting.set(false);
                this.isLoadingForm.set(false);
                this.notificationForm.reset();
                this.loadNotifications.emit();
                this.toastService.triggerAlert({
                    name: 'Registro exitoso',
                    color: 'success',
                    durationSeconds: 15
                });

                const modalElement = document.getElementById('createNotificationModal');
                if (modalElement) {
                    const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement)
                        || new (window as any).bootstrap.Modal(modalElement);
                    modalInstance.hide();
                }

                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.removeProperty('overflow');
                document.body.style.removeProperty('padding-right');
            },
            error: (err) => {
                this.toastService.triggerAlert({
                    name: 'Ocurrió un error en el sistema, intenta más tarde',
                    color: 'danger',
                    durationSeconds: 15
                });
                this.isSubmitting.set(false);
                this.isLoadingForm.set(false);
                this.errorMessage.set('Ocurrió un error de conexión con el servidor.');
            }
        });
    }
}