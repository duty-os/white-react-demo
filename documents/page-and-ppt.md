# 翻页与 PPT

white-web-sdk 允许多个页面。在房间初次创建时，只有一个空白页面。我们可以通过如下方法来插入/删除页面。

```typescript
// 插入新页面在指定 index
room.insertNewPage(index: number);

// 删除 index 位置的页面
room.removePage(index: number);
```

我们可以通过修改 globalState 来做到翻页效果。

```typescript
// 翻到第 4 页
var index = 3;

room.setGlobalState({
    currentSceneIndex: index,
});
```

注意，globalState 是整个房间所有人共用的。通过修改 globalState 的 currentSceneIndex 属性来翻页，将导致整个房间的所有人切换到该页。

white-web-sdk 还支持插入 PPT。插入的 PPT 将变成带有 PPT 内容的页面。我们需要先将 PPT 文件或 PDF 文件的每一页单独转化成一组图片，并将这组图片在互联网上发布（例如上传到某个云存储仓库中，并获取每一张图片的可访问的 URL）。

然后，将这组 URL 通过如下方法插入。

```typescript
room.pushPptPages([
    {src: "http://website.com/image-001.png", width: 1024, height: 1024},
    {src: "http://website.com/image-002.png", width: 1024, height: 1024},
    {src: "http://website.com/image-003.png", width: 1024, height: 1024},
]);
```

这个方法将在当前也后面插入 3 个带有 PPT 内容的新页面。