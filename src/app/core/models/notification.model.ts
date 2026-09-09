export enum NotificationColor {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

export enum NotificationTypeName {
  EXITO = 'Éxito',
  INFORMATIVO = 'Informativo',
  PRECAUCION = 'Precaución/Advertencia',
  ERROR = 'Error',
  RELOGIN = 'Redirigir a Login'
}

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
  allowClose?: boolean;

}

export interface NotificationRequest {
  folio?: number;
  companyId: number;
  countryId: number;
  systemId: number;
  messageTypeId: number;
  message: string;
  displayDuration: number;
  status: string;
  allowClose: boolean;
}

export interface NotificationResponse {
  messageTypeName: NotificationTypeName;
  message: string;
  displayDuration?: number | null;
  allowClose?: boolean;
  color: NotificationColor;
}

export interface NotificationInfoRequest {
  companyId: number;
  countryId: number;
  systemId: number;
  name?: string;
}

export interface NotificationConfig {
  name: NotificationTypeName;
  color: NotificationColor;
  durationSeconds?: number | null;
  allowClose?: boolean;
  message: string;
}

export interface AlertJson {
  message: string;
  color: NotificationColor;
  durationSeconds?: number | null;
  allowClose?: boolean;
}

export const INITIAL_NOTIFICATION_VALUES = {
  companyId: '',
  countryId: '',
  systemId: '',
  messageTypeId: '',
  message: '',
  status: 'A',
  displayDuration: null,
  allowClose: 'false'
};