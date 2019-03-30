import "./HomePage.css";

import * as React from "react";

import {stringify} from "query-string";
import {getMiniToken} from "./Token";
import {Redirect} from "react-router";

export type HomePageState = {
    readonly isLoading: boolean;
    readonly joinRoomUUID: string;
    readonly replaySliceUUID: string;
    readonly createdRoomMode: string;
    readonly redirectToPath?: string;
};

export type RoomDescription = {
    readonly uuid: string;
    readonly token: string;
};

export class HomePage extends React.Component<{}, HomePageState> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            isLoading: false,
            joinRoomUUID: "",
            replaySliceUUID: "",
            createdRoomMode: "persistent",
        };
    }

    private onClickCreateRoom = async (): Promise<void> => {
        try {
            this.setState({isLoading: true});
            const {uuid, token} = await this.createRoom();
            const query = stringify({token});

            // 跳转到该房间
            this.setState({redirectToPath: `/room/${uuid}?${query}`});

        } catch (error) {
            console.error(error);
            alert(error.message);
            this.setState({isLoading: false});
        }
    }

    /** 创建房间
     * @return uuid: 唯一标识刚才创建的房间，所有对该房间的操作都要用到它。
     *               业务服务器拿到它之后，可以将它传给前端，或存入数据库，以备接下来的操作。
     *         token: 房间 token，用于鉴权。
     * */
    private async createRoom(): Promise<RoomDescription> {

        // POST room 方法应该由服务端调用，此处仅为了方便演示，将它写在前端代码中。
        // 实践中的做法应该是，前端向后端业务服务器申请建立房间，业务服务器鉴权通过后，使用 miniToken 调用 White 的 API。
        const query = stringify({token: getMiniToken()});
        const url = `https://cloudcapiv4.herewhite.com/room?${query}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                name: "我的第一个 White 房间",
                limit: 302, // 房间人数限制
                mode: this.state.createdRoomMode,
            }),
        });
        if (response.status !== 200) {
            throw new Error(`create room failed with status code ${response.status} : ${response.statusText}`);
        }
        const json = await response.json();

        // uuid 唯一标识刚才创建的房间，所有对该房间的操作都要用到它。
        // 业务服务器拿到它之后，可以将它传给前端，或存入数据库，以备接下来的操作。
        return {
            uuid: json.msg.room.uuid as string,
            token: json.msg.roomToken as string,
        };
    }

    private onClickJoinRoom = async (): Promise<void> => {
        try {
            this.setState({isLoading: true});
            const uuid = this.state.joinRoomUUID;
            const token = await this.getRoomToken(uuid);
            const query = stringify({token});

            // 跳转到该房间
            this.setState({redirectToPath: `/room/${uuid}?${query}`});

        } catch (error) {
            console.error(error);
            alert(error.message);
            this.setState({isLoading: false});
        }
    }

    /**
     * 获取房间 token
     * 只有获取了该 token，才有权限进入房间
     *
     * @param {string} uuid 房间唯一识别符，createRoom 调用成功后方可获取
     * @return {string} token
     */
    private async getRoomToken(uuid: string): Promise<string> {

        // POST room/join 方法应该由服务端调用，此处仅为了方便演示，将它写在前端代码中。
        // 实践中的做法应该是，前端通过某种方法获取到房间 uuid 后，向后端业务服务器请求进入该房间。
        // 业务服务器在鉴权认为前端可以进入房间后，返回给它一个 roomToken。
        const query = stringify({uuid, token: getMiniToken()});
        const url = `https://cloudcapiv4.herewhite.com/room/join?${query}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        });
        if (response.status !== 200) {
            throw new Error(`get room token failed with status code ${response.status} : ${response.statusText}`);
        }
        const json = await response.json();
        return json.msg.roomToken as string;
    }

    public render(): React.ReactNode {
        if (this.state.redirectToPath) {
            return <Redirect to={this.state.redirectToPath}/>
        }
        return (
            <div className="home-page">
                <div className="bar">
                    <label>创建房间</label>
                    <select disabled={this.state.isLoading}
                            value={this.state.createdRoomMode}
                            onChange={event => this.setState({createdRoomMode: event.target.value})}>
                        <option value="transitory">临时房间</option>
                        <option value="persistent">持久化房间</option>
                        <option value="historied">可回放房间</option>
                    </select>
                    <button disabled={this.state.isLoading}
                            onClick={this.onClickCreateRoom}>
                        创建
                    </button>
                </div>
                <div className="bar">
                    <label>进入房间</label>
                    <input disabled={this.state.isLoading}
                           placeholder="请输入房间 uuid"
                           value={this.state.joinRoomUUID}
                           onChange={event => this.setState({joinRoomUUID: event.target.value})}/>
                    <button disabled={this.state.isLoading || this.state.joinRoomUUID === ""}
                            onClick={this.onClickJoinRoom}>
                        进入
                    </button>
                </div>
                <ReplayBox isLoading={this.state.isLoading}/>
            </div>
        );
    }
}

type ReplayBoxProps = {
    readonly isLoading: boolean;
};

type ReplayBoxState = {
    readonly roomUUID: string;
    readonly beginAt: string;
    readonly duration: string;
    readonly redirectToPath?: string;
};

class ReplayBox extends React.Component<ReplayBoxProps, ReplayBoxState> {

    public constructor(props: ReplayBoxProps) {
        super(props);
        this.state = {
            roomUUID: "",
            beginAt: "",
            duration: "",
        };
    }

    private didInputAll(): boolean {
        return (
            this.state.roomUUID !== "" &&
            this.state.beginAt !== "" &&
            this.state.duration !== ""
        );
    }

    private onClick = (): void => {
        const beginDate = new Date(this.state.beginAt.trim());
        const beginAt = beginDate.getTime();

        if (Number.isNaN(beginAt)) {
            alert("「开始播放时间」非法：" + JSON.stringify(this.state.beginAt));
            return;
        }
        const duration = Math.ceil(parseFloat(this.state.duration) * 1000);

        if (Number.isNaN(duration) || duration <= 0) {
            alert("「播放持续时间」非法：" + JSON.stringify(this.state.duration));
        }
        const query = stringify({beginAt, duration});

        // 跳转到该房间
        this.setState({redirectToPath: `/replay/${this.state.roomUUID}?${query}`});
    }

    public render(): React.ReactNode {
        if (this.state.redirectToPath) {
            return <Redirect to={this.state.redirectToPath}/>
        }
        return (
            <div className="bar">
                <label>回放房间</label>
                <button disabled={this.props.isLoading || !this.didInputAll()}
                        onClick={this.onClick}>
                    播放
                </button>
                <div>
                    <input disabled={this.props.isLoading}
                           placeholder="请输入房间 uuid"
                           value={this.state.roomUUID}
                           onChange={event => this.setState({roomUUID: event.target.value})}/>
                </div>
                <div>
                    <input disabled={this.props.isLoading}
                           placeholder="请输入开始播放时间（形如 2019-02-22 15:36:42）"
                           value={this.state.beginAt}
                           onChange={event => this.setState({beginAt: event.target.value})}/>
                </div>
                <div>
                    <input disabled={this.props.isLoading}
                           placeholder="请输入播放持续时间（秒）"
                           value={this.state.duration}
                           onChange={event => this.setState({duration: event.target.value})}/>
                </div>
            </div>
        );
    }
}
