import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LawyersService } from '../../../core/services/lawyers.service';
import { forceCloseModal } from '../../../core/helpers/modal.helper';
import { CatalogItem } from '../../../core/models/catalog.model';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { ContextService } from '../../../core/services/context.service';
import { email } from '@angular/forms/signals';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-simulator-form',
  templateUrl: './simulator-form.component.html',
})
export class SimulatorFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly lawyerService = inject(LawyersService);
  private readonly catalogService = inject(CatalogService);
  private readonly contextService = inject(ContextService)

  private modalElement: HTMLElement | null = null;

  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  loadLawyers = output<void>();

 simulatorForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(5)]],
  email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
});

  onSubmit(): void {
    if (this.simulatorForm.invalid) {
      this.simulatorForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValues = this.simulatorForm.getRawValue();

    const resquest$ = this.lawyerService.createLawyers(formValues);

    resquest$.subscribe({
      next: () => {
        this.resetFormState();
        forceCloseModal("simulatorModal");
        this.loadLawyers.emit();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.isLoading.set(false);
        this.errorMessage.set('Ocurrió un error de conexión con el servidor.');
      }
    });
  }

  private resetFormState(): void {
    this.isSubmitting.set(false);
    this.isLoading.set(false);
    this.simulatorForm.reset();
  }

}
