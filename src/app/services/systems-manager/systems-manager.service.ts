import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {take, pluck, mergeMap} from 'rxjs/operators';
import {loadStats} from '../../actions/stats.actions';
import {System, SystemStat} from '../../models/system';
import {State} from '../../reducers';
import {getSelectedReality} from '../../reducers/realities/realities.reducer';
import { Apollo } from 'apollo-angular';
import { loadSystemsAction } from 'src/app/actions/system.actions';
import * as queries from '../../queries/index';

@Injectable({providedIn: 'root'})
export class SystemsManagerService {

  constructor(private apollo: Apollo, 
    private stateStore: Store<State>) {}

  init() {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.subscribe((reality) => {
      this.apollo.query({query: queries.getSystems, variables: {reality}}).pipe(pluck("data", "getSystems")).subscribe((systems: System[]) => {
         this.stateStore.dispatch(loadSystemsAction({systems}));});
    });
  }

  getStat(serverId:number){
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));
    selectedReality.pipe(take(1)).subscribe((reality) => 
      {
      this.apollo.
        query({
          query: queries.getStats, variables: {reality, serverId}
        }).pipe(pluck("data", "getStats")).subscribe((result: SystemStat) => 
            this.stateStore.dispatch(loadStats({stats: result}))
      );
    });
  }

  addSystem(systemToAdd: System, reality: number) {
      return this.apollo.
        mutate({mutation: queries.addSystem, variables: {reality, systemToAdd}}).pipe(pluck("data", "addSystem"));
  }

  updateSystem(systemToUpdate: System, reality: number) {
    return this.apollo.
    mutate({mutation: queries.updateSystem, variables: {reality, systemToUpdate}}).pipe(pluck("data", "updateSystem"));
  }

  removeSystem(systemToRemove: System) {
    const selectedReality = this.stateStore.pipe(select(getSelectedReality));

    return selectedReality.pipe(mergeMap((reality: number) => {
      return this.apollo.
      mutate({
        mutation: queries.removeSystem,  variables: {reality, id: systemToRemove.id}
      }).pipe(pluck("data", "removeSystem"));
    }));
  }
}