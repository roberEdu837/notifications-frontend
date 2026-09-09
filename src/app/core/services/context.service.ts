import { Service } from "@angular/core";
import { NotificationInfoRequest } from "../models/notification.model";

@Service()
export class ContextService {

  getCurrentContext(): NotificationInfoRequest {
    return {
      systemId: Number(localStorage.getItem('systemId')),
      companyId: Number(localStorage.getItem('companyId')),
      countryId: Number(localStorage.getItem('countryId'))
    };

  }

  setCurrentContext(config: { systemId: number; companyId: number; countryId: number }): void {
    localStorage.setItem('systemId', config.systemId.toString());
    localStorage.setItem('companyId', config.companyId.toString());
    localStorage.setItem('countryId', config.countryId.toString());
  }

  clearContext(): void {
    localStorage.removeItem('systemId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('countryId');
  }

}

