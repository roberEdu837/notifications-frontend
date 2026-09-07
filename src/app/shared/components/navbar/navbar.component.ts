import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule,RouterLink],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
 isLoginPage: Signal<boolean> = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects.includes('/login'))
    ),
    { initialValue: window.location.pathname.includes('/login') || window.location.pathname === '/' }
  );
  
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
