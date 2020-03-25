import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {loadRealitiesAction} from '../../actions/realities.actions';
import {State} from '../../reducers';
import {getRealities, getSelectedReality, Reality} from '../../reducers/realities/realities.reducer';

@Injectable({providedIn: 'root'})
export class RealitiesManagerService {
  selectedReality: Reality;

  constructor(private httpClient: HttpClient,
              private stateStore: Store<State>) {
  }

  init() {
    this.httpClient.get('http://localhost:8080/realities', {withCredentials: false})
      .subscribe((realities: Reality[]) => {
        this.stateStore.dispatch(loadRealitiesAction({realities}));
      });
    const realities$ = this.stateStore.pipe(select(getRealities));
    const selectedReality$ = this.stateStore.pipe(select(getSelectedReality));
    combineLatest([realities$, selectedReality$]).subscribe(([allRealities, selectedReality]) => {
      this.selectedReality = allRealities.find(real => real.warriorReality === selectedReality);
    });
  }

  getSelectedReality() {
    return this.selectedReality;
  }
}
