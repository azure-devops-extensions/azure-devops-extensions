import { LoadStatus } from "Common/Contracts";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback } from "react";
import { IChecklistAwareState } from "../Redux/Checklist/Contracts";
import { getChecklistStatus } from "../Redux/Checklist/Selectors";

export function useChecklistStatus(idOrType: number | string): LoadStatus {
    const mapState = useCallback((state: IChecklistAwareState) => getChecklistStatus(state, idOrType), [idOrType]);
    return useMappedState(mapState);
}
