import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {take, map, pluck} from 'rxjs/operators';
import {loadStats} from '../../actions/stats.actions';
import {System, SystemStat} from '../../models/system';
import {State} from '../../reducers';
import {getSelectedReality, selectRealities} from '../../reducers/realities/realities.reducer';
import gql from "graphql-tag";
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { getSystemsStats } from 'src/app/reducers/stats/stats.reducer';
import { loadSystemsAction } from 'src/app/actions/system.actions';

@Injectable({providedIn: 'root'})
export class SystemsManagerService {

  constructor(private apollo: Apollo, 
    private stateStore: Store<State>) {}

  init() {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.subscribe((reality) => {
      this.apollo.query({query: gql ` query getSystems { getSystems(reality:${reality}) {
        id
        name
        team
        details
        icon
        isAlive
        lastAlive
      }}`}).pipe(pluck("data", "getSystems")).subscribe((systems: System[]) => {
         this.stateStore.dispatch(loadSystemsAction({systems}));});
    });
  }

  getStat(serverId:number){
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.pipe(take(1)).subscribe((reality) => 
      {
      this.apollo.
        query({
          query: gql`
          query getStats {
            getStats(statsInfoInput:{reality:${reality}, serverId:${serverId}}){
              serverId
              stats{
                duration_ms
                request_time
              }
          }}
          `
        }).pipe(pluck("data", "getStats")).subscribe(result => 
            this.stateStore.dispatch(loadStats({stats: result}))
      );
    });
  }
}