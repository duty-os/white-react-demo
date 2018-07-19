# 教具

## 切换教具

white-web-sdk 提供多种教具，我们可以通过修改 ``memberState`` 来切换当前的教具。例如，将当前教具切换成「铅笔」工具可以使用如下代码。

```typescript
room.setMemberState({
    currentApplianceName: "pencil",
});
```

可以通过如下代码获取当前房间的教具名称。

```typescript
room.state.memberState.currentApplianceName
```

white-web-sdk 提供如下教具。

| 名称 |  字符串   |       描述       |
| :--: | :-------: | :--------------: |
| 选择 | selector  | 选择、移动、放缩 |
| 铅笔 |  pencil   | 画出带颜色的轨迹 |
| 矩形 | rectangle |     画出矩形     |
| 椭圆 |  ellipse  |  画出正圆或椭圆  |
| 橡皮 |  eraser   |     删除轨迹     |
| 文字 |   text    |  编辑、输入文字  |

## 调色盘

通过如下代码可以修改调色盘的颜色。

```typescript
room.setMemberState({
    strokeColor: [255, 0, 0],
});
```

通过将 RGB 写在一个数组中，形如 [255, 0, 0] 来表示调色盘的颜色。

也可以根据如下代码获取当前调色盘的颜色。

```typescript
room.state.memberState.strokeColor
```

调色盘能影响铅笔、矩形、椭圆、文字工具的效果。