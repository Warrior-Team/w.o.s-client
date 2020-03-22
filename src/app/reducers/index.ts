import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import * as fromSystems from './systems/systems.reducer';
import * as fromRealities from './realities/realities.reducer';
import * as fromStats from './stats/stats.reducer';
import * as fromLayout from './layout/layout.reducer';


export interface State {
  [fromSystems.systemsFeatureKey]: fromSystems.SystemsState;
  [fromRealities.realitiesFeatureKey]: fromRealities.RealitiesState;
  [fromStats.statsFeatureKey]: fromStats.StatsState;
  [fromLayout.layoutFeatureKey]: fromLayout.LayoutState;
}

export const reducers: ActionReducerMap<State> = {
  [fromSystems.systemsFeatureKey]: fromSystems.reducer,
  [fromRealities.realitiesFeatureKey]: fromRealities.reducer,
  [fromStats.statsFeatureKey]: fromStats.reducer,
  [fromLayout.layoutFeatureKey]: fromLayout.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
