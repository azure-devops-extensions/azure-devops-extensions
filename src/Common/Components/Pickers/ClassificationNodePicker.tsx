import "./ClassificationNodePicker.scss";

import * as React from "react";
import { ComboBox } from "azure-devops-ui/ComboBox";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ITreeItem, Tree, TreeItemProvider } from "azure-devops-ui/Tree";
import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { IClassificationNode } from "Common/Redux/ClassificationNodes";
import { isNullOrEmpty } from "Common/Utilities/String";
import { IComboBox } from "OfficeFabric/components/ComboBox/ComboBox.types";

export type IClassificationNodePickerSharedProps = ILabelledComponentProps & IInputComponentProps<string>;

export interface IClassificationNodePickerProps {
    rootNode: IClassificationNode;
}

class ClassificationNodeProvider extends TreeItemProvider<IClassificationNode> {
    constructor(private _rootNode: IClassificationNode) {
        super();
    }

    public getChildren(item: IClassificationNode): IClassificationNode[] {
        if (!item) {
            return [this._rootNode];
        }
        return item.children;
    }

    public getTreeItem(item: IClassificationNode): ITreeItem<IClassificationNode> {
        return {
            isExpandable: item.children && item.children.length > 0,
            id: item.id.toString(),
            defaultIsExpanded: false,
            item: item
        };
    }
}

function useClassificationNodeProvider(rootNode: IClassificationNode) {
    const [provider, setProvider] = React.useState<ClassificationNodeProvider | undefined>(undefined);

    React.useEffect(() => {
        if (rootNode) {
            setProvider(new ClassificationNodeProvider(rootNode));
        } else {
            setProvider(undefined);
        }
    }, [rootNode]);

    return provider;
}

export function ClassificationNodePicker(props: IClassificationNodePickerProps & IClassificationNodePickerSharedProps) {
    const { label, disabled, rootNode, info, className, required, getErrorMessage, onChange, value: prop_value } = props;
    const [value, setValue] = useControlledState(prop_value);

    const provider = useClassificationNodeProvider(rootNode);
    let combobox: IComboBox;

    const comboBoxComponentRef = (component: IComboBox) => (combobox = component);
    const onNodeSelect = (_ev: React.MouseEvent, node: IClassificationNode) => {
        combobox.dismissMenu();
        const nodePath = node.path;
        setValue(nodePath);
        if (onChange) {
            onChange(nodePath);
        }
    };
    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && isNullOrEmpty(value) ? "A value is required" : undefined);
    };

    const onRenderList = (): JSX.Element | null => {
        if (!provider) {
            return null;
        }
        return (
            <Tree
                treeItemProvider={provider}
                isHeaderVisible={false}
                primaryTreeColumnKey="name"
                onPrimaryCellClick={onNodeSelect}
                columns={[
                    {
                        key: "name",
                        name: "Name",
                        fieldName: "name",
                        minWidth: 100,
                        maxWidth: 200,
                        onRender: (item: ITreeItem<IClassificationNode>) => {
                            if (!item.item) {
                                return null;
                            }
                            const name = item.item.name;
                            return (
                                <Tooltip overflowOnly={true}>
                                    <span className="classification-picker-tree-cell text-ellipsis">{name}</span>
                                </Tooltip>
                            );
                        }
                    }
                ]}
            />
        );
    };

    return (
        <LabelledComponent
            className={css("classification-picker", className, disabled && "disabled")}
            label={label}
            info={info}
            required={required}
            getErrorMessage={getError}
        >
            <ComboBox
                allowFreeform={false}
                autoComplete={false}
                disabled={disabled}
                options={[]}
                text={value || ""}
                componentRef={comboBoxComponentRef}
                onRenderList={onRenderList}
            />
        </LabelledComponent>
    );
}
