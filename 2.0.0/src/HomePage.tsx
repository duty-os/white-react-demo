import "./HomePage.css";

import * as React from "react";

import {stringify} from "query-string";
import {getMiniToken} from "./Token";
import {Redirect} from "react-router";

export type HomePageState = {
    readonly isLoading: boolean;
    readonly uuidValue: string;
    readonly redirectToRoom?: RoomDescription;
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
            uuidValue: "",
        };
    }

    private onClickCreateRoom = async (): Promise<void> => {
        try {
            this.setState({isLoading: true});
            const roomDescription = await this.createRoom();

            // 跳转到该房间
            this.setState({redirectToRoom: roomDescription})

        } catch (error) {
            alert(error.message);
            console.error(error);
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
        const url = `https://cloudcapiv3.herewhite.com/room?${query}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                name: "我的第一个 White 房间",
                limit: 100, // 房间人数限制
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
            const uuid = this.state.uuidValue;
            const token = await this.getRoomToken(uuid);

            // 跳转到该房间
            this.setState({redirectToRoom: {uuid, token}})

        } catch (error) {
            alert(error.message);
            console.error(error);
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
        const url = `https://cloudcapiv3.herewhite.com/room/join?${query}`;
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
        if (this.state.redirectToRoom) {
            const {uuid, token} = this.state.redirectToRoom;
            const query = stringify({token});

            return <Redirect to={`/room/${uuid}?${query}`}/>
        }
        return (
            <div className="home-page">
                <div className="bar">
                    <label>创建房间</label>
                    <button disabled={this.state.isLoading}
                            onClick={this.onClickCreateRoom}>
                        创建
                    </button>
                </div>
                <div className="bar">
                    <label>进入房间</label>
                    <input disabled={this.state.isLoading}
                           placeholder="请输入房间 uuid"
                           value={this.state.uuidValue}
                           onChange={event => this.setState({uuidValue: event.target.value})}/>
                    <button disabled={this.state.isLoading || this.state.uuidValue === ""}
                            onClick={this.onClickJoinRoom}>
                        进入
                    </button>
                </div>
            </div>
        );
    }
}
