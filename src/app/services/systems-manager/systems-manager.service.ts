import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {take, map, pluck, mergeMap} from 'rxjs/operators';
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
          query getStats($reality: Int, $serverId: Int) {
            getStats(statsInfoInput:{reality:$reality, serverId:$serverId}){
              serverId
              stats{
                duration_ms
                request_time
              }
          }}
          `, variables: {reality, serverId}
        }).pipe(pluck("data", "getStats")).subscribe((result: SystemStat) => 
            this.stateStore.dispatch(loadStats({stats: result}))
      );
    });
  }

  addSystem(systemToAdd: System, reality: number) {
      return this.apollo.
        mutate({mutation: gql ` mutation addSystem($reality: Int, $systemToAdd: systemInput) {
          addSystem(reality:$reality, data: $systemToAdd)
          {
            id
            name
            team
            details
            icon
            isAlive
            lastAlive
          }
        }`, variables: {reality, systemToAdd}}).pipe(pluck("data", "addSystem"));
  }

  updateSystem(systemToUpdate: System, reality: number) {
    return this.apollo.
    mutate({mutation: gql ` mutation updateSystem($reality: Int, $systemToUpdate: systemInput) {
      updateSystem(reality:$reality, data: $systemToUpdate)
      {
        id
        name
        team
        details
        icon
        isAlive
        lastAlive
      }
    }`, variables: {reality, systemToUpdate}}).pipe(pluck("data", "updateSystem"));
  }

  removeSystem(systemToRemove: System) {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));

    return selectedReality.pipe(mergeMap((reality: number) => {
      return this.apollo.
      mutate({
        mutation: gql`
          mutation removeSystem ($reality: Int, $id: Int) {
            removeSystem(reality:$reality, id: $id)
          }
        `,  variables: {reality, id: systemToRemove.id}
      }).pipe(pluck("data", "removeSystem"));
    }));
  }
}