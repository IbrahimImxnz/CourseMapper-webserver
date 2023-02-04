import { createAction, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as AppState from 'src/app/state/app.state'
import * as MaterialActions from 'src/app/pages/components/materils/state/materials.actions'
import {  } from 'src/app/models/Annotations';


export interface State extends AppState.State{
    materials: MaterialState;
}

export interface MaterialState {
  materialId: string,
  courseId: string,
  channelSelected
}

const initialState: MaterialState = {
materialId: null,
courseId: null,
channelSelected: false
}

const getMaterialFeatureState = createFeatureSelector<MaterialState>('material');

export const getCurrentMaterialId = createSelector(
  getMaterialFeatureState,
  state => state.materialId
);

export const getCurrentCourseId = createSelector(
  getMaterialFeatureState,
  state => state.courseId
);

export const getChannelSelected = createSelector(
  getMaterialFeatureState,
  state => state.channelSelected
);


export const materialReducer = createReducer<MaterialState>(
    initialState,
    on(MaterialActions.setCourseId, (state, action): MaterialState => {
      return {
        ...state,
        courseId: action.courseId
      };
    }),

    on(MaterialActions.setMaterialId, (state, action): MaterialState => {
      return {
        ...state,
        materialId: action.materialId
      };
    }),

    on(MaterialActions.toggleChannelSelected, (state, action): MaterialState => {
      return {
        ...state,
        channelSelected: action.channelSelected
      };
    }),
  );