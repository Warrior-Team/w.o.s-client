import {createAction, props} from '@ngrx/store';
import {SideNavButtons} from '../models/enums';

export const toggleSidenavAction = createAction('[Layout] Toggle Sidenav');
export const showMainContainerAction = createAction('[Layout] Show Main Container', props<{ containerType: SideNavButtons }>());
