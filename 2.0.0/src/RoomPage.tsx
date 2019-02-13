import * as React from "react";

import {RouteComponentProps} from "react-router";
import {parse} from "query-string";

export type RoomPageProps = RouteComponentProps<{
    readonly uuid: string;
}>;

export class RoomPage extends React.Component<RoomPageProps> {

    private readonly uuid: string;
    private readonly token: string;

    public constructor(props: RoomPageProps) {
        super(props);
        this.uuid = props.match.params.uuid;
        this.token = parse(props.location.search).token;
    }

    public render(): React.ReactNode {
        return <div>uuid: {this.uuid} token: {this.token}</div>;
    }
}
