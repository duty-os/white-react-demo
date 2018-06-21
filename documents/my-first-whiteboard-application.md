# 我的第一个白板应用

本文将引导你在自己的 Web 应用中引入 white-web-sdk。你可以结合如下 demo 来阅读。

- [whiteboard-typescript](https://github.com/duty-os/white-demo/tree/master/whiteboard-typescript)
- [whiteboard-es6](https://github.com/duty-os/white-demo/tree/master/whiteboard-es6)

## 前端安装

你需要一个 React 项目，在此基础上，你可以通过如下命令安装 white-web-sdk。

```bash
npm install white-web-sdk --save
```

如果你使用 TypeScript，还需要引入 ``*.d.ts`` 文件。你需要在你的 ``tsconfig.json`` 中的 ``compilerOptions`` 中添加如下内容：

```json
"paths": {
    "*" : ["node_modules/white-web-sdk/types/*"]
}
```

然后，你还需要引入 ``*.css`` 文件。如果你使用 ``css-loader`` 之类的库，可以在整个项目的入口文件 ``index.js`` 中加入 ``import "white-web-sdk/style/index.css";`` 。

如果你没有使用类似库，则需要将 ``node_modules/white-web-sdk/style`` 中的静态文件上传到你的 nginx 服务器的资源文件夹（或云存储空间）中，并在网页的 ``<head>`` 中配置它们。

```html
<link rel="stylesheet" type="text/css" href="https://static.my-app.com/static/white-web-sdk/style/index.css">
```

至此，white-web-sdk 就成功的安装到了你的项目中了。

## 准备后端业务服务器

首先，你需要获取一个 mini-token，它将作为调用 white API 的凭证。mini-token 应该只由业务服务器持有，不要泄漏给其他人，也不要写到前端的代码中。

业务服务器通过 https 协议调用 white 的 API，每次调用都要带 mini-token。

## 业务流程

白板的业务核心是房间，同一个房间里的人互相是可见的。房间关键方法有 3 个：创建、加入、关闭。

### 创建房间

业务服务器调用 white 的 API 创建房间，获取房间的 uuid。对于房间而言，uuid 能唯一标识它。业务服务器获取 uuid 后，可以将它通过网络传给前端，或存入数据库。具体怎么做取决于应用的业务。

### 加入房间

前端通过业务流程获取到房间的 uuid 后，就可以申请加入房间了。

首先，前端要向业务服务器索取 room-token。业务服务器会对前端的请求进行鉴权，如果通过，业务服务器会调用 white 的 API，获取到该房间的 room-token。并将其返回前端。

该 room-token 只颁发给发起请求的前端，而且该前端也只能用它加入与之对应的房间。

前端获取到 room-token 之后，就可以调用 white-web-sdk 中的方法，与 white 服务器建连，并加入房间。

在整个房间的生命周期中，「加入房间」可能会执行多次。

### 关闭房间

业务服务器可以通过 white 的 API 关闭特定房间（通过房间 uuid）。该房间会被立即关闭，如果房间内还有成员，则所有成员会被强制断连。成员可以通过 white-web-sdk 的回调区分自己是因为房间被关闭而被断连，还是网络原因被断连。

## 前端业务代码编写

首先，前端需要构造 SDK 实例。

```javascript
var WhiteWebSdk = require("white-web-sdk").WhiteWebSdk;
var sdk = new WhiteWebSdk();
```

然后，通过业务服务器获取某个房间的 uuid 和 room-token。这时就可以通过 API 加入该房间了。

```javascript
var promise = sdk.joinRoom({
    uuid: uuid,
    roomToken: roomToken,
});
```

该方法是一个异步方法，返回一个 Promise 对象。你可以通过如下方法来异步获取 ``room`` 对象。

```javascript
promise.then(function(room) {
    // 加入房间成功后，room 对象会作为参数传给你。
});
```

当然，加入房间可能失败，这时候你需要处理这个 Error。

```javascript
promise.catch(function(error) {
    // 加入房间失败了，你得到一个 Error 对象。
});
```

成功加入房间后，你就可以显示出白板了。将获得的 room 对象传给你的 React Component ，并通过如下代码将白板显示在网页上。

```jsx
var RoomWhiteboard = require("white-web-sdk").RoomWhiteboard;

render() {
    return <RoomWhiteboard room={room}/>;
}
```

## 后端业务代码编写

你可以使用任意语言实现业务服务器，只要这种语言支持 https 即可。在这里，我们用 node 作为例子。我们使用 ``fetch`` 来发起 https 请求。

### 创建房间

```javascript
var url = "https://cloudapi.herewhite.com/room?token=" + miniToken;

fetch(url, {
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
}).then(function(response) {
    return response.json();
    
}).then(function(json) {
    // uuid 唯一标识刚才创建的房间，所有对该房间的操作都要用到它。
    // 业务服务器拿到它之后，可以将它传给前端，或存入数据库，以备接下来的操作。
    var uuid = json.msg.room.uuid;;
});
```

### 为加入房间的前端颁发 room-token

```javascript
var url = "https://cloudapi.herewhite.com/room/join?uuid=" + uuid + "&token=" + miniToken;

fetch(url, {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
}).then(function(response) {
    return response.json();
    
}). then(function(json) {
    // 将 roomToken 传给前端
    var roomToken = json.msg.roomToken;
});
```

## 关闭房间

```javascript
var url = "https://cloudapi.herewhite.com/room/close?token=" + miniToken;

fetch(url, {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        uuid: uuid,
    }),
}).then(function(response) {
    // 关闭房间成功
});
```

