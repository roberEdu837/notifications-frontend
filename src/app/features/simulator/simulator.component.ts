import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LawyersService } from '../../core/services/lawyers.service';
import { LawyersResponse } from '../../core/models/lawyers.model';
import { SimulatorFormComponent } from './simulator-form/simulator-form.component';
import { SimulatorFormConfiguration } from './simulator-form-configuration/simulator-form-configuration.component';
import { ContextService } from '../../core/services/context.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule,SimulatorFormComponent,SimulatorFormConfiguration],
  templateUrl: './simulator.component.html',
})
export class SimulatorComponent {
  private readonly lawyersService = inject(LawyersService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contextService = inject(ContextService);
  private readonly toastService = inject(ToastService);
private readonly notificationService = inject(NotificationService);

  lawyers = signal<LawyersResponse[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadLawyers();
  }

  loadLawyers(): void {
    this.isLoading.set(true);

    this.lawyersService.getAllLawyers().subscribe({
      next: (data: LawyersResponse[]) => {
        this.lawyers.set([...data]);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al cargar los datos:', err);
        this.cdr.detectChanges();
      }
    });
  }

  sendInformationNotification(): void {
    const context = this.contextService.getCurrentContext();
    const payload = { ...context, name: 'Informativo' };

    if (payload.companyId !== 0) {
      this.notificationService.getNotificationByInfo(payload).subscribe({
        next: (res: any) => {
          if (res) {
            this.toastService.triggerAlert({
              color: res.color,
              message: res.message,
              allowClose: res.allowClose || null,
              durationSeconds: res.displayDuration || 5
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener la notificación:', err);
        }
      });
    }
  }

}

