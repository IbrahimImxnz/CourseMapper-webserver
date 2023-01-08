import { createAction, props } from "@ngrx/store";
import { Material } from "src/app/models/Material";

// Strongly typed actions

export const setMaterialId = createAction(
    '[Materials] Set Current materialId',
    props<{materialId: string}>()
);

export const setCourseId = createAction(
    '[Materials] Set current courseId',
    props<{courseId: string}>()
);

