import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`/auth/login`, credentials).pipe(
            tap((response: AuthResponse) => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);

    }
}
