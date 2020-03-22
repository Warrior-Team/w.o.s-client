import {Action, createReducer, createSelector, on} from '@ngrx/store';
import {toggleCreateAction, toggleViewAction} from '../../actions/layout.actions';
import {State} from '../index';


export const layoutFeatureKey = 'layout';

export interface LayoutState {
  view: boolean;
  create: boolean;
}

export const initialState: LayoutState = {
  view: true,
  create: false
};

const layoutReducer = createReducer(
  initialState,
  on(toggleViewAction, handleToggleView),
  on(toggleCreateAction, handleToggleCreate)
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}

function handleToggleView(state: LayoutState, action): LayoutState {
  return {
    ...state,
    create: false,
    view: !state.view || true
  };
}

function handleToggleCreate(state: LayoutState, action): LayoutState {
  return {
    ...state,
    view: false,
    create: !state.create || true
  };
}

export const selectLayout = (state: State) => state[layoutFeatureKey];

export const layoutSelector = createSelector(selectLayout, (state) => state);

export const getView = createSelector(layoutSelector, (state) => state.view);

export const getCreate = createSelector(layoutSelector, (state) => state.create);

