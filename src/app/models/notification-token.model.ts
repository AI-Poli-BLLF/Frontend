import {SafeUrl} from '@angular/platform-browser';

export enum NotificationType {STUDENT_ENROLLING, PROFESSOR_COOPERATION, RESPONSE}
export class NotificationToken {
  id: string;
  senderId: string;
  courseName: string;
  message: string;
  notificationRead: boolean;
  creation: string;
  type: NotificationType;
  photoPath: SafeUrl;

  constructor(id: string, senderId: string, courseName: string, message: string,
              notificationRead: boolean, type: NotificationType, creation: string) {
    this.id = id;
    this.senderId = senderId;
    this.courseName = courseName;
    this.message = message;
    this.notificationRead = notificationRead;
    this.type = type;
    this.creation = creation;
  }
}
