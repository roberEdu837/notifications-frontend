import { Component, inject, signal, input, output, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NotificationService } from "../../../core/services/notification.service";
import { CatalogItem } from "../../../core/models/catalog.model";
import { MessageType } from "../../../core/models/message-types.model";
import { INITIAL_NOTIFICATION_VALUES, NotificationItem } from "../../../core/models/notification.model";
import { ToastService } from "../../../core/services/toast.service";
import { forceCloseModal } from "../../../core/helpers/modal.helper";

@Component({
    selector: 'app-notification-form',
    templateUrl: './notification-form.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class NotificationFormComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly toastService = inject(ToastService);
    private readonly fb = inject(FormBuilder);

    countries = input.required<CatalogItem[]>();
    companies = input.required<CatalogItem[]>();
    systems = input.required<CatalogItem[]>();
    messageTypes = input.required<MessageType[]>();
    notificationData = input<NotificationItem | null>(null);
    loadNotifications = output<void>();


    isLoadingForm = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    errorMessage = signal<string>('');

    notificationForm: FormGroup = this.fb.group({
        companyId: ['', [Validators.required]],
        countryId: ['', [Validators.required]],
        systemId: ['', [Validators.required]],
        messageTypeId: ['', [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        displayDuration: [null, []],
        status: ['A', [Validators.required]]
    });

    constructor() {
        effect(() => {
            console.log(this.notificationData())
            const data = this.notificationData();
            if (data) {
                this.notificationForm.patchValue(data);
            } else {
                this.notificationForm.reset(INITIAL_NOTIFICATION_VALUES);
            }
        });
    }

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
            next: () => {
                this.resetFormState();
                this.loadNotifications.emit();
                forceCloseModal("createNotificationModal");
            },
            error: () => {
                this.isSubmitting.set(false);
                this.isLoadingForm.set(false);
                this.errorMessage.set('Ocurrió un error de conexión con el servidor.');
            }
        });
    }

    private resetFormState(): void {
        this.isSubmitting.set(false);
        this.isLoadingForm.set(false);
        this.notificationForm.reset(INITIAL_NOTIFICATION_VALUES);
    }
}