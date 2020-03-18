import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {filter} from 'rxjs/operators';
import {updateSystemsAction} from '../../actions/system.actions';
import {System} from '../../models/system';
import {State} from '../../reducers';
import {Reality} from '../../reducers/realities/realities.reducer';
import {PushNotificationsService} from '../push-notifications/push-notifications.service';

export interface Message {
  type: string;
  server: string;
  reality: Reality;
  status?: 'down' | 'up';
  data: Partial<System>;
}

@Injectable()
export class SocketsManagerService {
  private sockets: WebSocketSubject<any>;

  constructor(private pushNotificationsService: PushNotificationsService,
              private stateStore: Store<State>) {
  }

  init() {
    this.sockets = new WebSocketSubject('ws://localhost:9090');
    this.sockets
      .pipe(filter((message: Message) => message.type === 'notification'))
      .subscribe((message: Message) => {
        console.log('Got new Message', message);
        this.notify(`server ${message.server} is ${message.status} in reality ${message.reality.name}`,
          `${message.server} is ${message.status}`, message.status);
      });
    this.sockets
      .pipe(filter((message: Message) => message.type === 'update'))
      .subscribe(((message: Message) => {
          this.stateStore.dispatch(updateSystemsAction({systems: [message.data]}));
        })
      );
  }

  notify(body: string, cardTitle: string, status: string) {
    const data: any[] = [];
    data.push({
      title: cardTitle,
      alertContent: body,
      icon: status !== null && status !== undefined ? `../../../assets/images/${status}.ico` : `../../../assets/images/favicon.ico`
    });
    this.pushNotificationsService.generateNotification(data);
  }
}
