import "./App.css";
import * as React from "react";
import {Room, WhiteWebSdk, RoomWhiteboard} from "white-react-sdk";

export type AppState = {
    room?: Room;
};

export class App extends React.Component<{}, AppState> {

    private readonly whiteWebSdk: WhiteWebSdk;

    // [注意]
    // miniToken 不应该存储在前端，也不应该通过网络传输。
    // 它应该仅由业务服务器持有，并使用它调用 White 的 API。
    // 此处仅为了方便演示，将它写在前端代码中。
    private static readonly miniToken = "此处填写你获取的 miniToken";

    public constructor(props: {}) {
        super(props);
        this.whiteWebSdk = new WhiteWebSdk();
        this.state = {};
    }

    public async componentWillMount(): Promise<void> {
        try {
            const uuid = await this.createRoom();
            const roomToken = await this.getRoomToken(uuid);

            await this.joinRoom(uuid, roomToken);

        } catch (error) {
            console.error(error);
        }
    }

    /** 创建房间
     * @return {string} uuid: 唯一标识刚才创建的房间，所有对该房间的操作都要用到它。
     *                        业务服务器拿到它之后，可以将它传给前端，或存入数据库，以备接下来的操作。
     * */
    private async createRoom(): Promise<string> {

        // POST room 方法应该由服务端调用，此处仅为了方便演示，将它写在前端代码中。
        // 实践中的做法应该是，前端向后端业务服务器申请建立房间，业务服务器鉴权通过后，使用 miniToken 调用 White 的 API。
        const url = `https://cloudcapiv3.herewhite.com/room?token=${App.miniToken}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                name: "我的第一个 White 房间",
                limit: 100, // 房间人数限制
                width: 1024,
                height: 768,
            }),
        });
        if (response.status !== 200) {
            throw new Error(`create room failed with status code ${response.status} : ${response.statusText}`);
        }
        const json = await response.json();

        // uuid 唯一标识刚才创建的房间，所有对该房间的操作都要用到它。
        // 业务服务器拿到它之后，可以将它传给前端，或存入数据库，以备接下来的操作。
        return json.msg.room.uuid;
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
        const url = `https://cloudcapiv3.herewhite.com/room/join?uuid=${uuid}&token=${App.miniToken}`;
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

    private async joinRoom(uuid: string, roomToken: string): Promise<void> {
        // 该方法应该在前端调用
        // 调用次方法前，应该从业务服务器获取房间 uuid 和 roomToken
        // 进入房间成功后，会获取 room 对象
        const room = await this.whiteWebSdk.joinRoom({
            uuid: uuid,
            roomToken: roomToken,
        });
        console.log(`join room "${uuid}" successfully`);

        this.setState({
            room: room,
        });
    }

    public render(): React.ReactNode {
        if (!this.state.room) {
            // 在成功加入房间之前无法获取 room 对象，此时无法显示白板。
            return <div>is joining room...</div>;
        } else {
            return (
                <RoomWhiteboard className="app-whiteboard"
                                room={this.state.room}/>
            );
        }
    }
}

export default App;
