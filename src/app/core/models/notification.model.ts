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