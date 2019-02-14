import * as React from "react";

const toolboxItems: ReadonlyArray<{title: string, appliance: string}> = Object.freeze([
    Object.freeze({title: "选择", appliance: "selector"}),
    Object.freeze({title: "铅笔", appliance: "pencil"}),
    Object.freeze({title: "橡皮", appliance: "eraser"}),
    Object.freeze({title: "文字", appliance: "text"}),
    Object.freeze({title: "矩形", appliance: "rectangle"}),
    Object.freeze({title: "圆形", appliance: "ellipse"}),
]);

export type ApplianceBarProps = {
    readonly appliance?: string;
    readonly disabled: boolean;
    readonly onApplianceChanged: (appliance: string) => void;
};

export const ApplianceBar: React.FunctionComponent<ApplianceBarProps> = props => (
    <select className="appliance-bar"
            disabled={props.disabled}
            value={props.appliance || toolboxItems[0].appliance}
            onChange={event => props.onApplianceChanged(event.target.value)}>
        {toolboxItems.map(({title, appliance}) => (
            <option key={appliance} value={appliance}>{title}</option>
        ))}
    </select>
);
