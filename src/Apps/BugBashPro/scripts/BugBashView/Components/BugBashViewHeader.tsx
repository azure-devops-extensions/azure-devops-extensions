import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { isBugBashCompleted, isBugBashInProgress } from "BugBashPro/BugBashDirectory/Helpers";
import { BugBashEditorPortalActions } from "BugBashPro/BugBashEditor/Redux/Portal";
import { BugBashItemEditorPortalActions } from "BugBashPro/BugBashItemEditor/Redux/Portal";
import { Resources } from "BugBashPro/Resources";
import { IBugBash, LoadStatus } from "BugBashPro/Shared/Contracts";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { useActionCreators } from "Common/Hooks/Redux";
import { BugBashViewHeaderCommands } from "../Constants";
import { useBugBashItems } from "../Hooks/useBugBashItems";
import { IBugBashViewBaseProps } from "../Interfaces";

const Actions = {
    openBugBashEditorPanel: BugBashEditorPortalActions.openPortal,
    openNewBugBashItemPanel: BugBashItemEditorPortalActions.openPortal
};

export function BugBashViewHeader(props: IBugBashViewBaseProps) {
    const { bugBash } = props;
    const { status, loadBugBashItems } = useBugBashItems(bugBash.id!);
    const { openNewBugBashItemPanel, openBugBashEditorPanel } = useActionCreators(Actions);

    const renderHeaderTitle = React.useMemo(() => onRenderHeaderTitle(bugBash), [bugBash]);
    const isLoading = status !== LoadStatus.Ready;

    return (
        <Header
            className="bugbash-page-header bugbash-view-page-header"
            title={renderHeaderTitle}
            commandBarItems={[
                {
                    ...BugBashViewHeaderCommands.new,
                    disabled: isLoading,
                    onActivate: () => {
                        openNewBugBashItemPanel(bugBash);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.edit,
                    disabled: isLoading,
                    onActivate: () => {
                        openBugBashEditorPanel(bugBash.id);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.refresh,
                    disabled: isLoading,
                    onActivate: () => {
                        loadBugBashItems(bugBash.id!);
                    }
                }
            ]}
            titleSize={TitleSize.Medium}
        />
    );
}

function onRenderHeaderTitle(bugBash: IBugBash): JSX.Element {
    const currentTime = new Date();
    let statusProps: IStatusProps;
    if (isBugBashCompleted(bugBash, currentTime)) {
        statusProps = {
            text: Resources.Completed,
            ...Statuses.Success
        };
    } else if (isBugBashInProgress(bugBash, currentTime)) {
        statusProps = {
            text: Resources.InProgress,
            ...Statuses.Running
        };
    } else {
        statusProps = {
            text: Resources.Scheduled,
            ...Statuses.Queued
        };
    }

    return (
        <div className="header-breadcrumb flex-row flex-center title-m">
            <Button className="header-breadcrumb-button" subtle={true} onClick={navigateToDirectory}>
                Bug Bashes
            </Button>
            <span className="seperator">></span>
            <span>{bugBash.title}</span>
            <div className="bugbash-header-status flex-column justify-center">
                <Status {...statusProps} size={StatusSize.l} animated={false} />
            </div>
        </div>
    );
}
