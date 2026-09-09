import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { ContextService } from '../../../core/services/context.service';
import { CatalogItem } from '../../../core/models/catalog.model';
import { forkJoin } from 'rxjs';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-simulator-form-configuration',
  styleUrl: './simulator-form-configuration.component.css',
  templateUrl: './simulator-form-configuration.component.html',
})
export class SimulatorFormConfiguration implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogService);
  private readonly contextService = inject(ContextService);

  private modalElement: HTMLElement | null = null;

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

  ngOnInit(): void {
    this.loadCatalogs();
  }

  ngAfterViewInit(): void {
    this.modalElement = document.getElementById('simulatorModal');
  }

  onSubmit(): void {
    if (this.simulatorConfigForm.invalid) {
      this.simulatorConfigForm.markAllAsTouched();
      return;
    }

    const formValues = this.simulatorConfigForm.getRawValue();
    this.contextService.setCurrentContext(formValues);
    this.isActionEnabled.set(true);
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
}