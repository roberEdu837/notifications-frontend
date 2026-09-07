import { Component, inject, OnInit, ChangeDetectorRef, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../core/services/notification.service";
import { NotificationItem } from "../../core/models/notification.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CatalogService } from "../../core/services/catalog.service";
import { CatalogItem } from "../../core/models/catalog.model";
import { forkJoin } from "rxjs";
import { MessageType } from "../../core/models/message-types.model";

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {

    private readonly notificationService = inject(NotificationService);
    private readonly catalogService = inject(CatalogService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly fb = inject(FormBuilder);
    private modalElement: HTMLElement | null = null;

    countries = signal<CatalogItem[]>([]);
    companies = signal<CatalogItem[]>([]);
    systems = signal<CatalogItem[]>([]);
    messageTypes = signal<MessageType[]>([]);
    isLoadingCatalogs = signal<boolean>(false);
    isLoadingForm = signal<boolean>(false);

    notifications = signal<NotificationItem[]>([]);
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    errorMessage: string = '';


    notificationForm: FormGroup = this.fb.group({
        companyId: ['', [Validators.required]],
        countryId: ['', [Validators.required]],
        systemId: ['', [Validators.required]],
        messageTypeId: ['', [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(5)]],
        displayDuration: [10, [Validators.required, Validators.min(1)]],
        status: ['A', [Validators.required]]
    });


    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(): void {
        this.isLoading.set(true);

        this.notificationService.getNotifications().subscribe({
            next: (data) => {
                this.notifications.set([...data]);
                this.isLoading.set(false);
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error al cargar notificaciones:', err);
                this.cdr.detectChanges();
            }
        });
    }

    ngAfterViewInit(): void {
        this.modalElement = document.getElementById('createNotificationModal');

        if (this.modalElement) {
            this.modalElement.addEventListener('shown.bs.modal', this.onModalOpen);
        }
    }

    private onModalOpen = () => {
        if (this.countries.length === 0 || this.companies.length === 0 || this.systems.length === 0) {
            this.loadCatalogs();
        }
    }

    loadCatalogs(): void {
        if (this.countries().length > 0) return;

        this.isLoadingCatalogs.set(true);

        forkJoin({
            countries: this.catalogService.getCountries(),
            companies: this.catalogService.getCompanies(),
            systems: this.catalogService.getSystems(),
            messageTypes: this.catalogService.getMessageTypes()
        }).subscribe({
            next: (res) => {
                this.countries.set(res.countries);
                this.companies.set(res.companies);
                this.systems.set(res.systems);
                this.messageTypes.set(res.messageTypes);
                this.isLoadingCatalogs.set(false);
            },
            error: (err) => {
                console.error('Error al cargar catálogos:', err);
                this.isLoadingCatalogs.set(false);
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
    this.errorMessage = '';

    this.notificationService.createNotification(this.notificationForm.getRawValue()).subscribe({
        next: () => {
            this.isSubmitting.set(false);
            this.isLoadingForm.set(false);
            this.notificationForm.reset({ displayDuration: 10, status: 'A' });
            this.loadNotifications();

            if (this.modalElement) {
                const modalInstance = (window as any).bootstrap.Modal.getInstance(this.modalElement) 
                    || new (window as any).bootstrap.Modal(this.modalElement);
                modalInstance.hide();
            }

            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        },
        error: (err) => {
            this.isSubmitting.set(false);
            this.isLoadingForm.set(false);
            this.errorMessage = err.status === 401 || err.status === 403
                ? 'Usuario o contraseña incorrectos.'
                : 'Ocurrió un error de conexión con el servidor.';
        }
    });
}
}