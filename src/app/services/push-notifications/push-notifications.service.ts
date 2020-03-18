import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class PushNotificationsService {
  permission: Permission;

  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  async requestPermission(): Promise<void> {
    const self = this;
    if (this.isSupported()) {
      await Notification.requestPermission((status) => {
        return self.permission = status;
      });
    }
  }

  create(title: string, options ?: NotificationOptions): any {
    return new Observable((obs) => {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (this.permission !== 'granted') {
        console.log('The user hasn\'t granted you permission to send push notifications');
        obs.complete();
      }
      const notify: Notification = new Notification(title, options);
      notify.onshow = (e) => {
        return obs.next({
          notification: notify,
          event: e
        });
      };
      notify.onclick = (e) => {
        alert('Hello');
        return obs.next({
          notification: notify,
          event: e
        });
      };
      notify.onerror = (e) => {
        return obs.error({
          notification: notify,
          event: e
        });
      };
      notify.onclose = () => {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    const self = this;
    source.forEach((item) => {
      const options: NotificationOptions = {
        body: item.alertContent,
        icon: item.icon ? item.icon : '../../../assets/images/favicon.ico',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        dir: 'ltr'
      };
      self.create(item.title, options).subscribe();
    });
  }
}

export declare type Permission = 'denied' | 'granted' | 'default';
