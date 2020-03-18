import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {take} from 'rxjs/operators';
import {loadStats} from '../../actions/stats.actions';
import {loadSystemsAction} from '../../actions/system.actions';
import {System, SystemStat} from '../../models/system';
import {State} from '../../reducers';
import {getSelectedReality} from '../../reducers/realities/realities.reducer';

@Injectable({providedIn: 'root'})
export class SystemsManagerService {

  constructor(private httpClient: HttpClient,
              private stateStore: Store<State>) {
  }

  init() {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.subscribe((reality) => {
      this.httpClient.post('http://localhost:8080/systems', null, {headers: {reality: reality.toString()}, withCredentials: false})
        .subscribe((systems: System[]) => {
          this.stateStore.dispatch(loadSystemsAction({systems}));
        });
    });
  }

  getStat(serverId: number) {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.pipe(take(1)).subscribe(reality => {
      this.httpClient.post('http://localhost:8080/statistic', {serverId}, {headers: {reality: reality.toString()}, withCredentials: false})
        .subscribe((systemStat: SystemStat) => {
          this.stateStore.dispatch(loadStats({stats: systemStat}));
        });
    });
  }
}

