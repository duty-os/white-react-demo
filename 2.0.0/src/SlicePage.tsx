import "./SlicePage.css";

import * as React from "react";

import {parse} from "query-string";
import {RouteComponentProps} from "react-router";
import {WhiteWebSdk, Player, PlayerWhiteboard} from "white-react-sdk";
import {RoomPageProps} from "./RoomPage";

export type SlicePageProps = RouteComponentProps<{
    readonly uuid: string;
}>;

export type SlicePageState = {
    readonly player: Player | null;
};

export class SlicePage extends React.Component<SlicePageProps, SlicePageState> {

    private readonly uuid: string;
    private readonly beginAt: number;
    private readonly duration: number;
    private readonly whiteWebSdk: WhiteWebSdk;

    public constructor(props: RoomPageProps) {
        super(props);
        this.whiteWebSdk = new WhiteWebSdk();
        this.uuid = props.match.params.uuid;
        this.state = {
            player: null,
        };
        const query = parse(this.props.location.search);
        this.beginAt = parseInt(query.beginAt);
        this.duration = parseInt(query.duration);
    }

    public componentWillMount(): void {
        this.replaySlice().catch(error => {
            console.error(error);
            alert(error.message);
        });
    }

    private async replaySlice(): Promise<void> {
        const player = await this.whiteWebSdk.replayRoom({
            room: this.uuid,
            roomToken: "TODO",
            beginTimestamp: this.beginAt,
            duration: this.duration,
        }, {
            onLoadFirstFrame: () => {},
            onScheduleTimeChanged: timestamp => {},
        });
        player.seekToScheduleTime(0);
        player.play();

        this.setState({player});
    }

    public render(): React.ReactNode {
        return (
            <div className="slice-page">
                {this.state.player && (
                    <div className="whiteboard-container">
                        <PlayerWhiteboard className="whiteboard"
                                          player={this.state.player}/>
                    </div>
                )}
            </div>
        );
    }
}
