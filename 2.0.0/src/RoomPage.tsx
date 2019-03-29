import "./RoomPage.css";

import * as React from "react";

import {RouteComponentProps} from "react-router";
import {parse} from "query-string";
import {Room, RoomPhase, WhiteWebSdk} from "white-react-sdk";
import {ApplianceBar} from "./ApplianceBar";

export type RoomPageProps = RouteComponentProps<{
    readonly uuid: string;
}>;

export type RoomPageState = {
    readonly room: Room | null;
    readonly appliance: string;
    readonly phase: RoomPhase;
};

export class RoomPage extends React.Component<RoomPageProps, RoomPageState> {

    private readonly uuid: string;
    private readonly token: string;
    private readonly whiteWebSdk: WhiteWebSdk;

    public constructor(props: RoomPageProps) {
        super(props);
        this.whiteWebSdk = new WhiteWebSdk();
        this.uuid = props.match.params.uuid;
        this.token = parse(props.location.search).token;
        this.state = {
            room: null,
            appliance: "",
            phase: RoomPhase.Connecting,
        };
    }

    public componentWillMount(): void {
        window.addEventListener("resize", this.refreshRoomViewSize);
        for(let i=0; i<1; i++) {
            this.joinRoom().catch(error => {
                console.error(error);
                // alert(error.message);
            });
        }
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.refreshRoomViewSize);
    }

    private async joinRoom(): Promise<void> {
        // 该方法应该在前端调用
        // 调用次方法前，应该从业务服务器获取房间 uuid 和 roomToken
        // 进入房间成功后，会获取 room 对象
        await this.whiteWebSdk.joinRoom({
            uuid: this.uuid,
            roomToken: this.token,
        }, {
            onPhaseChanged: phase => this.setState({phase}),
            onRoomStateChanged: ({memberState}) => {
                if (memberState && memberState.currentApplianceName !== this.state.appliance) {
                    this.setState({appliance: memberState.currentApplianceName});
                }
            },
        });
        console.log(`join room "${this.uuid}" successfully`);

        // this.setState({
        //     room: room,
        //     appliance: room.state.memberState.currentApplianceName,
        // });
    }

    public render(): React.ReactNode {
        return (
            <div className="room-page">
                {this.renderTopBar()}
                {this.renderWhiteboard()}
            </div>
        );
    }

    private currentRoomPhaseDescription(): string {
        switch (this.state.phase) {
            case RoomPhase.Connecting: {
                return "正在连接";
            }
            case RoomPhase.Connected: {
                return "已连接";
            }
            case RoomPhase.Reconnecting: {
                return "正在重连";
            }
            case RoomPhase.Disconnecting: {
                return "正在断开连接";
            }
            case RoomPhase.Disconnected: {
                return "已离开";
            }
            default: {
                return this.state.phase;
            }
        }
    }

    private refreshRoomViewSize = (): void => {
        if (this.state.room) {
            this.state.room.refreshViewSize();
        }
    }

    private renderTopBar(): React.ReactNode {
        return (
            <div className="top-bar">
                <label>房间号：{this.uuid}</label>
                <label>房间状态：{this.currentRoomPhaseDescription()}</label>
                <label>分片：{(this.state.room && this.state.room.slice) || "-"}</label>
                {this.renderApplianceBar()}
            </div>
        );
    }

    private renderApplianceBar(): React.ReactNode {
        const room = this.state.room;

        if (!room) {
            return null;
        }
        const appliance = this.state.appliance;
        const isConnected = this.state.phase === RoomPhase.Connected;

        return <ApplianceBar appliance={appliance}
                             disabled={!isConnected}
                             onApplianceChanged={appliance => {
                                 room.setMemberState({currentApplianceName: appliance});
                                 this.setState({appliance});
                             }}/>
    }

    private renderWhiteboard(): React.ReactNode {
        const room = this.state.room;

        if (!room) {
            return null;
        }
        return (
            <div className="whiteboard-container">
                {/* <RoomWhiteboard className="whiteboard" room={room}/> */}
            </div>
        );
    }
}
