import { WorkItemRelationTypeActions } from "Common/Redux/WorkItemRelationTypes/Actions";
import { IWorkItemRelationTypeAwareState } from "Common/Redux/WorkItemRelationTypes/Contracts";
import { workItemRelationTypeReducer } from "Common/Redux/WorkItemRelationTypes/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { workItemRelationTypesSaga } from "./Sagas";

export function getWorkItemRelationTypeModule(): ISagaModule<IWorkItemRelationTypeAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemRelationTypeAwareState, WorkItemRelationTypeActions> = {
        workItemRelationTypeState: workItemRelationTypeReducer
    };

    return {
        id: "workItemRelationTypes",
        reducerMap,
        sagas: [workItemRelationTypesSaga]
    };
}
