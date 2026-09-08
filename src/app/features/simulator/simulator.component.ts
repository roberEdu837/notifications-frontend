import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LawyersService } from '../../core/services/lawyers.service';
import { LawyersResponse } from '../../core/models/lawyers.model';
import { SimulatorFormComponent } from './simulator-form/simulator-form.component';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule,SimulatorFormComponent],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
})
export class SimulatorComponent {
  private readonly lawyersService = inject(LawyersService);
  private readonly cdr = inject(ChangeDetectorRef);
  private modalElement: HTMLElement | null = null;

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

}

