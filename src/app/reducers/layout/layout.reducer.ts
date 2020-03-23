import {Action, createReducer, createSelector, on} from '@ngrx/store';
import {showMainContainerAction, toggleSidenavAction} from '../../actions/layout.actions';
import {SideNavButtons} from '../../models/enums';
import {State} from '../index';


export const layoutFeatureKey = 'layout';

export interface LayoutState {
  mainContainer: SideNavButtons;
  sidenav: boolean;

}

export const initialState: LayoutState = {
  mainContainer: SideNavButtons.View,
  sidenav: false
};

const layoutReducer = createReducer(
  initialState,
  on(toggleSidenavAction, handleToggleSidenav),
  on(showMainContainerAction, showMainContainer)
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}

function showMainContainer(state: LayoutState, action): LayoutState {
  return {
    ...state,
    sidenav: false,
    mainContainer: action.containerType
  };
}

function handleToggleSidenav(state: LayoutState): LayoutState {
  return {
    ...state,
    sidenav: !state.sidenav
  };
}

export const selectLayout = (state: State) => state[layoutFeatureKey];

export const layoutSelector = createSelector(selectLayout, (state) => state);

export const getSidenav = createSelector(layoutSelector, (state) => state.sidenav);

export const getMainContainer = createSelector(layoutSelector, (state) => state.mainContainer);
