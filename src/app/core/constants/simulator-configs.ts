import {  AlertJson, NotificationColor, NotificationConfig, NotificationTypeName } from "../models/notification.model";


export const SIMULATOR_CONFIGURATIONS: NotificationConfig[] = [
  {
    name: NotificationTypeName.EXITO,
    color: NotificationColor.SUCCESS,
    durationSeconds: 15,
    allowClose: false,
    message: 'La operación se realizó correctamente'
  },
  {
    name: NotificationTypeName.INFORMATIVO,
    color: NotificationColor.INFO,
    durationSeconds: 15,
    allowClose: false,
    message: 'Hemos enviado un token al correo electrónico ingresado'
  },
  {
    name: NotificationTypeName.PRECAUCION,
    color: NotificationColor.WARNING,
    durationSeconds: 0,
    allowClose: true,
    message: 'La información que intentas guardar ya existe'
  },
  {
    name: NotificationTypeName.RELOGIN,
    color: NotificationColor.DANGER,
    durationSeconds: 0,
    allowClose: true,
    message: 'Ocurrió un error en el sistema, intenta más tarde'
  },
  {
    name: NotificationTypeName.ERROR,
    color: NotificationColor.WARNING,
    durationSeconds: 10,
    allowClose: true,
    message: 'Sesión expirada. Serás redirigido al login.'
  }
];

export function getCustomMappedConfig(typeName: string): AlertJson | undefined {
  const foundConfig = SIMULATOR_CONFIGURATIONS.find(
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
