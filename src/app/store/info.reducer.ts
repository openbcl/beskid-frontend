import { createReducer, on } from "@ngrx/store";
import { Info } from "./info";
import * as InfoAction from './info.actions';

export const infoFeatureKey = 'infos';

export interface InfoState {
  info: Info,
  error: any;
}

export const initialInfoState: InfoState = {
  info: {
    frontend: {
      version: '0.0.0',
      branch: 'unkown',
      commit: '0000000'
    },
    backend: {
      branch: 'unkown',
      commit: '0000000'
    }
  },
  error: null
};

export const infoReducer = createReducer(
  initialInfoState,

  on(InfoAction.obtainInfoSuccess, (state, action) => {
    return { ...state, info: action.info };
  }),

  on(InfoAction.obtainInfoFailure, (state, action) => {
    return { ...state, error: action.error };
  }),
)
