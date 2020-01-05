import { Action, ActionReducer, ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { listReducer } from '../reducers/auditListReducer';
import { gridReducer } from '../reducers/gridWidthReducer';
import { switchesReducer } from '../reducers/switchesListReducer';
import { localStorageSync } from 'ngrx-store-localstorage';

export const FEATURE_NAME = 'Onos';
const STORE_KEYS_TO_PERSIST = ['auditList', 'gridList', 'switchesList'];


export interface OnosState {
  auditList: any;
  gridList: any;
  switchesList: any;
}

export const reducers: ActionReducerMap<OnosState> = {
  auditList: listReducer,
  gridList: gridReducer,
  switchesList: switchesReducer,
};

export const getOnosState = createFeatureSelector<OnosState>(FEATURE_NAME);


export function localStorageSyncReducer(reducer: ActionReducer<OnosState>): ActionReducer<OnosState> {
  return localStorageSync({
    keys: STORE_KEYS_TO_PERSIST,
    rehydrate: true,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<OnosState, Action>> = [localStorageSyncReducer];
