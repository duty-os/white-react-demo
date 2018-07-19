其他功能

## 自定义事件

white-web-sdk 允许向房间广播自定义事件。事件可以传递一个 JSON 数据结构，该数据结构会被房间其他人接收。

我们可以用如下代码发送自定义事件。

```typescript
var event = "EVENT_NAME";
var payload = {...};
room.dispatchMagixEvent(event, payload);
```

