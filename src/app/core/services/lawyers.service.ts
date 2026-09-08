import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { LawyersRequest, LawyersResponse } from '../models/lawyers.model';

@Service()
export class LawyersService {
    private readonly http = inject(HttpClient);

    getAllLawyers() {
        return this.http.get<[LawyersResponse]>('/lawyers');
    }

    createLawyers(lawyer: LawyersRequest){
            return this.http.post<LawyersResponse>('/lawyers', lawyer);
        
    }

}
