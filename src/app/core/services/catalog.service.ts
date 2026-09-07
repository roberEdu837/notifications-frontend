import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CatalogItem } from '../models/catalog.model';
import { MessageType } from '../models/message-types.model';

@Service()
export class CatalogService {

    private readonly http = inject(HttpClient);

    getCompanies() {
        return this.http.get<CatalogItem[]>('/catalags/companies');
    }

    getSystems() {
        return this.http.get<CatalogItem[]>('/catalags/systems');
    }

    getCountries() {
        return this.http.get<CatalogItem[]>('/catalags/countries');
    }

    getMessageTypes() {
        return this.http.get<MessageType[]>('/catalags/message-types');
    }
    
}
