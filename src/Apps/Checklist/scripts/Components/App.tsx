import { ChecklistGroup } from "Checklist/Components/WorkItemFormGroup/ChecklistGroup";
import { ReduxHooksStoreProvider } from "Common/Redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

const store = createStore({}, [], [getSagaExtension()]);

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <ChecklistGroup />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
