# 主播模式

## 跟随主播的视角

white-web-sdk 提供的白板是向四方无限延生的。同时也允许用户通过鼠标滚轮、手势等方式移动白板。因此，即便是同一块白板的同一页，不同用户的屏幕上可能看到的内容是不一样的。

为此，我们引入「主播模式」这个概念。主播模式将房间内的某一个人设为主播，他/她屏幕上看到的内容即是其他所有人看到的内容。当主播进行视角的放缩、移动时，其他人的屏幕也会自动进行放缩、移动。

主播模式中，主播就好像摄像机，其他人就好像电视机。主播看到的东西会被同步到其他人的电视机上。

可以通过如下方法修改当前视角的模式。

```typescript
// 主播模式
// 房间内其他人的视角模式会被自动修改成 follower，并且强制观看你的视角。
// 如果房间内存在另一个主播，该主播的视角模式也会被强制改成 follower。
// 就好像你抢了他/她的主播位置一样。
room.setViewMode("broadcaster");

// 自由模式
// 你可以自由放缩、移动视角。
// 即便房间里有主播，主播也无法影响你的视角。
room.setViewMode("freedom");

// 追随模式
// 你将追随主播的视角。主播在看哪里，你就会跟着看哪里。
// 在这种模式中如果你放缩、移动视角，将自动切回 freedom模式。
room.setViewMode("follower");
```

我们也可以通过如下方法获取当前视角的状态。

```typescript
room.state.broadcastState
```

它的结构如下。

```typescript
export type BroadcastState = {
    
    // 当前视角模式，有如下：
    // 1."freedom" 自由视角，视角不会跟随任何人
    // 2."follower" 跟随视角，将跟随房间内的主播
    // 2."broadcaster" 主播视角，房间内其他人的视角会跟随我
    mode: ViewMode;
    
    // 房间主播 ID。
    // 如果当前房间没有主播，则为 undefined
    broadcasterId?: number;
};
```

## 视角中心

同一个房间的不同用户各自的屏幕尺寸可能不一致，这将导致他们的白板都有各自不同的尺寸。实际上，房间的其他用户会将白板的中心对准主播的白板中心（注意主播和其他用户的屏幕尺寸不一定相同）。

我们需要通过如下方法设置白板的尺寸，以便主播能同步它的视角中心。

```
room.setViewSize(1024, 768);
```

尺寸应该和白板在网页中的实际尺寸相同（一般而言就是浏览器页面的尺寸）。如果用户调整了窗口大小导致白板尺寸改变。应该重新调用该方法刷新尺寸。