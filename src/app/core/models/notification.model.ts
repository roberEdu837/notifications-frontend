export interface NotificationItem {
  folio: number;
  companyId: number;
  companyName: string;
  countryId: number;
  countryName: string;
  systemId: number;
  systemName: string;
  messageTypeId: number;
  messageTypeName: string;
  message: string;
  displayDuration: number;
  status: string;
  createdAt: string;
    allowClose?:boolean;

}

export interface NotificationRequest {
  companyId: number;
  countryId: number;
  systemId: number;
  messageTypeId: number;
  message: string;
  displayDuration: number;
  status: string;
}

export interface NotificationResponse{
  messageTypeName:string;
  message: string;
  displayDuration?:number | null;
  allowClose?:boolean;
  color: 'success' | 'danger' | 'warning' | 'info';
}

export interface NotificationInfoRequest {
  companyId: number;
  countryId: number;
  systemId: number;
  name: string;
}