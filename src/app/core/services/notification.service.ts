import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationInfoRequest, NotificationItem, NotificationRequest } from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  getNotifications() {
    return this.http.get<NotificationItem[]>('/messages');
  }

  createNotification(notification: NotificationRequest) {
    return this.http.post<NotificationRequest>('/messages', notification);
  }

  updateNotification(folio: number, notification: NotificationRequest) {
    return this.http.put<NotificationRequest>(`/messages/${folio}`, notification);
  }

  deleteLogicalNotification(folio: number) {
    return this.http.patch(`/messages/${folio}/delete`, {});
  }

  getNotificationByInfo(config: NotificationInfoRequest) {
    return this.http.post(`/messages/configuration`, config);

  }


}