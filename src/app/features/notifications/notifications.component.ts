import { Component, inject, OnInit, ChangeDetectorRef, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../core/services/notification.service";
import { NotificationItem } from "../../core/models/notification.model";
import { ReactiveFormsModule } from "@angular/forms";
import { CatalogService } from "../../core/services/catalog.service";
import { CatalogItem } from "../../core/models/catalog.model";
import { forkJoin } from "rxjs";
import { MessageType } from "../../core/models/message-types.model";
import { NotificationFormComponent } from "./notification-form/notification-form.component";
import { ToastService } from "../../core/services/toast.service";

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NotificationFormComponent],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {

    private readonly notificationService = inject(NotificationService);
    private readonly catalogService = inject(CatalogService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly toastService = inject(ToastService);

    private modalElement: HTMLElement | null = null;

    folioFilter = signal<string>('');
    countries = signal<CatalogItem[]>([]);
    companies = signal<CatalogItem[]>([]);
    systems = signal<CatalogItem[]>([]);
    messageTypes = signal<MessageType[]>([]);
    isLoadingCatalogs = signal<boolean>(false);
    selectedNotification = signal<NotificationItem | null>(null);
    statusFilter = signal<string>('A');
    notifications = signal<NotificationItem[]>([]);
    isLoading = signal<boolean>(false);
    errorMessage: string = '';

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

    openEditModal(notification: NotificationItem): void {
        if (this.countries().length === 0) {
            this.loadCatalogs();
        }
        this.selectedNotification.set(notification);
    }

    ngAfterViewInit(): void {
        this.modalElement = document.getElementById('createNotificationModal');

        if (this.modalElement) {
            this.modalElement.addEventListener('shown.bs.modal', () => {
                if (this.countries().length === 0 || this.companies().length === 0 || this.systems().length === 0) {
                    this.loadCatalogs();
                }
            });

            this.modalElement.addEventListener('hidden.bs.modal', () => {
                this.selectedNotification.set(null);
            });
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

    deleteNotification(folio: number): void {
        this.notificationService.deleteLogicalNotification(folio).subscribe({
            next: () => {
               
                this.loadNotifications();
                this.toastService.triggerAlert({
                    color: 'success',
                    name: `Borrado exitoso`,
                    durationSeconds: 10
                });
            },
            error: (err) => {
                console.error('Error al eliminar la notificación:', err);
                this.cdr.detectChanges();
            }
        });
    }

    filteredNotifications = computed(() => {
        const status = this.statusFilter();
        const folioQuery = this.folioFilter().trim().toLowerCase();
        const items = this.notifications();

        return items.filter(item => {
            const matchesStatus = item.status === status;
            const matchesFolio = folioQuery === '' || item.folio.toString().toLowerCase().includes(folioQuery);
            return matchesStatus && matchesFolio;
        });
    });
}