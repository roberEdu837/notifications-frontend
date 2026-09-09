import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AlertJson, NotificationInfoRequest, NotificationItem, NotificationRequest, NotificationResponse } from "../models/notification.model";
import { map, Observable } from "rxjs";

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

getNotificationByInfo(config: NotificationInfoRequest): Observable<AlertJson> {
  return this.http.post<NotificationResponse>(`/messages/configuration`, config).pipe(
    map((response: NotificationResponse): AlertJson => {
      return {
        color: response.color,
        message: response.message,
        allowClose: response?.allowClose ?? false,
        durationSeconds: response?.displayDuration ?? null
      };
    })
  );
}


}