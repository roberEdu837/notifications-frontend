import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LawyersService } from '../../../core/services/lawyers.service';
import { forceCloseModal } from '../../../core/helpers/modal.helper';
import { CatalogItem } from '../../../core/models/catalog.model';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { ContextService } from '../../../core/services/context.service';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-simulator-form',
  styleUrl: './simulator-form.component.css',
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
  countries = signal<CatalogItem[]>([]);
  companies = signal<CatalogItem[]>([]);
  systems = signal<CatalogItem[]>([]);
  isLoadingCatalogs = signal<boolean>(false);
  isActionEnabled = signal<boolean>(false);

  simulatorConfigForm: FormGroup = this.fb.group({
    companyId: ['', Validators.required],
    countryId: ['', Validators.required],
    systemId: ['', Validators.required],
  });

  simulatorForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]]
  });


  ngAfterViewInit(): void {
    this.modalElement = document.getElementById('simulatorModal');

    if (this.modalElement) {
      this.modalElement.addEventListener('shown.bs.modal', () => {
        if (this.countries().length === 0 || this.companies().length === 0 || this.systems().length === 0) {
          this.loadCatalogs();
        }
      });

    }
  }

  onSubmitSimulator(): void {
    if (this.simulatorConfigForm.invalid) {
      this.simulatorConfigForm.markAllAsTouched();
      return;
    }

    const formValues = this.simulatorConfigForm.getRawValue();
    this.contextService.setCurrentContext(
      formValues
    );
    this.isActionEnabled.set(true);
  }


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

  loadCatalogs(): void {
    if (this.countries().length > 0) return;

    this.isLoadingCatalogs.set(true);

    forkJoin({
      countries: this.catalogService.getCountries(),
      companies: this.catalogService.getCompanies(),
      systems: this.catalogService.getSystems(),
    }).subscribe({
      next: (res) => {
        this.countries.set(res.countries);
        this.companies.set(res.companies);
        this.systems.set(res.systems);
        this.isLoadingCatalogs.set(false);
      },
      error: (err) => {
        console.error('Error al cargar catálogos:', err);
        this.isLoadingCatalogs.set(false);
      }
    });
  }

  private resetFormState(): void {
    this.isSubmitting.set(false);
    this.isLoading.set(false);
    this.simulatorForm.reset();
  }

}
