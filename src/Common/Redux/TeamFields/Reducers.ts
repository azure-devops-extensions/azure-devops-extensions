import { TeamFieldActions, TeamFieldActionTypes } from "Common/Redux/TeamFields/Actions";
import { defaultState, ITeamFieldState, ITeamFieldValues } from "Common/Redux/TeamFields/Contracts";
import { produce } from "immer";

export function teamFieldReducer(state: ITeamFieldState | undefined, action: TeamFieldActions): ITeamFieldState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case TeamFieldActionTypes.BeginLoad: {
                const teamId = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()] = {
                    teamId: teamId,
                    loading: true
                } as ITeamFieldValues;
                break;
            }

            case TeamFieldActionTypes.LoadFailed: {
                const { teamId, error } = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()].error = error;
                draft.teamFieldsMap[teamId.toLowerCase()].loading = false;
                break;
            }

            case TeamFieldActionTypes.LoadSucceeded: {
                const { teamId, teamFieldValues } = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()] = {
                    loading: false,
                    teamId: teamId,
                    ...teamFieldValues
                };
            }
        }
    });
}
