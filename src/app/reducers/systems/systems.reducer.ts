import {Action, createReducer, createSelector, on} from '@ngrx/store';
import {
  addSystemsAction,
  loadSystemsAction,
  removeSystemsAction,
  toggleSystemGraphAction,
  updateSystemsAction
} from '../../actions/system.actions';
import {System} from '../../models/system';
import {State} from '../index';


export const systemsFeatureKey = 'systems';

export interface SystemsState {
  systems: System[];
}

export const initialState: SystemsState = {
  systems: []
};

const systemsReducer = createReducer(
  initialState,
  on(loadSystemsAction, loadSystems),
  on(updateSystemsAction, updateSystems),
  on(addSystemsAction, addSystems),
  on(removeSystemsAction, removeSystem),
  on(toggleSystemGraphAction, toggleSystemGraph)
);

export function reducer(state: SystemsState | undefined, action: Action) {
  return systemsReducer(state, action);
}

function loadSystems(state: SystemsState, action): SystemsState {
  return {
    ...state,
    systems: action.systems
  };
}

function addSystems(state: SystemsState, action): SystemsState {
  return {
    ...state,
    systems: [...state.systems, ...action.systems]
  };
}

function updateSystems(state: SystemsState, action): SystemsState {
  const systemsToUpdate: Partial<System>[] = action.systems;
  const systemsToUpdateMap: Map<number, Partial<System>> = new Map<number, Partial<System>>();
  for (const sys of systemsToUpdate) {
    systemsToUpdateMap.set(sys.id, sys);
  }
  const systems = state.systems.map(system => {
    const foundSys = systemsToUpdateMap.get(system.id);
    if (foundSys) {
      return Object.assign({}, system, foundSys);
    } else {
      return system;
    }
  });
  return {
    ...state,
    systems
  };
}

function removeSystem(state: SystemsState, action): SystemsState {
  return {
    ...state,
    systems: state.systems.filter(sys => sys.id !== action.systemId)
  };
}

function toggleSystemGraph(state: SystemsState, action): SystemsState {
  const newSystem = action.systemId;
  const isGraphOpen = action.isGraphOpen;
  let systemToUpdate = state.systems.find(system => system.id === newSystem);
  const newState = state.systems.filter(system => system.id !== newSystem);
  if (systemToUpdate) {
    systemToUpdate = Object.assign({}, systemToUpdate, {isGraphOpen});
    return {
      ...state,
      systems: [...newState, systemToUpdate]
    };
  } else {
    return {
      ...state,
      systems: [...newState]
    };
  }
}

export const selectSystems = (state: State) => state[systemsFeatureKey];

export const systemsSelector = createSelector(selectSystems, (state) => state);

export const getSystems = createSelector(systemsSelector, (state) => state.systems);
