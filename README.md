# white web sdk

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/herewhite/white-stack)

## 简介

white-web-sdk 可以为你的 Web 应用提供一块实时互动白板。你的应用必须使用 React（版本在 16 或以上）来将白板引入到你的网页上。

白板会自行监听鼠标 / 触碰事件。在桌面端浏览器，用户可以直接使用鼠标在白板上写写画画，通过滚轮和组合按键移动视角；在移动端浏览器，用户可以通过触碰与拖拽的方式写写画画，通过多指手势调整视角。

这些操作会通过网络自动实时地同步给同一房间的每一个用户。这意味着你在白板上的操作同房间的其他人都可以看到，同房间其他人的操作你也可以看到。

**以上内容无须特别设置**，仅仅将白板引入你的网页即可。

white-web-sdk 还提供多种工具，如选择器、铅笔、文字、圆形工具、矩形工具。同时还提供图片展示工具和 PPT 工具。这些功能的展现形式，关系到具体网页应用本身的交互设计、视觉风格。考虑到这一点，白板上没有直接提供这些 UI 组件。你只能通过程序调用的方式，来让白板使用这些功能。

具体来说，你需要做如下工作：

- 你必须设计并实现一套工具 UI 组件，并将它放在网页上。
- 当用户操作 UI 组件时（如按下某个你准备好的按钮），你需要调用 white-web-sdk 的 API 以执行该操作。
- 你需要监听 white-web-sdk 的状态变化，以随时更新 UI 组件，以便它能及时反应白板的实时状况。

## 导航

- **[我的第一个白板应用](documents/my-first-whiteboard-application.md)**
- **[白板的工具制作与状态管理](documents/whiteboard-state.md)**
- **[教具](documents/appliances.md)**
- **[页面与 PPT](documents/page-and-ppt.md)**
- **[主播模式](documents/broadcaster-mode.md)**
