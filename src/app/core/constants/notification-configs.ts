import {  AlertJson, NotificationColor, NotificationConfig, NotificationTypeName } from "../models/notification.model";


export const NOTIFICATION_CONFIGURATIONS: NotificationConfig[] = [
  {
    name: NotificationTypeName.EXITO,
    color: NotificationColor.SUCCESS,
    durationSeconds: 15,
    allowClose: false,
    message: 'Registro exitoso'
  },
  {
    name: NotificationTypeName.ERROR,
    color: NotificationColor.SUCCESS,
    durationSeconds: 15,
    allowClose: false,
    message: 'Borrado exitoso'
  },
  
];

export function getCustomMappedConfig(typeName: string): AlertJson | undefined {
  const foundConfig = NOTIFICATION_CONFIGURATIONS.find(
    config => config.name.toLowerCase() === typeName.toLowerCase()
  );

  if (!foundConfig) return undefined;

  return {
    color:foundConfig.color,
    message:foundConfig.message,
    allowClose: foundConfig.allowClose,
    durationSeconds: foundConfig.durationSeconds || null
  };
}
