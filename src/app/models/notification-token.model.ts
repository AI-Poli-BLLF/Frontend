import {SafeUrl} from '@angular/platform-browser';

export enum NotificationType {STUDENT_ENROLLING, PROFESSOR_COOPERATION, RESPONSE}
export class NotificationToken {
  private static months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Sep', 'Ott', 'Nov', 'Dic'];
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
    this.type = NotificationToken.parseType(type);
    this.creation = NotificationToken.buildTimestamp(creation);
  }

  private static parseType(type) {
    switch (type) {
      case 'PROFESSOR_COOPERATION':
        return NotificationType.PROFESSOR_COOPERATION;
      case 'STUDENT_ENROLLING':
        return NotificationType.STUDENT_ENROLLING;
      case 'RESPONSE':
        return NotificationType.RESPONSE;
      default:
        return type;
    }
  }

  private static buildTimestamp(timestamp: string): string{
    const date: string[] = timestamp.split('T')[0].split('-');
    const month: number = parseInt(date[1], 10);
    const day = date[2];
    return `${day} ${NotificationToken.months[month - 1]}`;
  }
}
