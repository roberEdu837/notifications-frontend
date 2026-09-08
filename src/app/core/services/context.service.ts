import { Service } from "@angular/core";
import { NotificationInfoRequest } from "../models/notification.model";

@Service()
export class ContextService{
    
    getCurrentContext():  NotificationInfoRequest{
    return {
      systemId: Number(localStorage.getItem('systemId')),
      companyId: Number(localStorage.getItem('companyId')),
      countryId: Number(localStorage.getItem('countryId'))
    };
  }

}

