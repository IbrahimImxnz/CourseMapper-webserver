import { createAction, props } from "@ngrx/store";
import { } from "src/app/models/Annotations";
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

export const setMouseEvent = createAction(
    '[Material] Set Mouse Event',
    props<{mouseEvent: MouseEvent}>()
);
