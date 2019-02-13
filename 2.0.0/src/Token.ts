// [注意]
// miniToken 不应该存储在前端，也不应该通过网络传输。
// 它应该仅由业务服务器持有，并使用它调用 White 的 API。
// 此处仅为了方便演示，将它写在前端代码中。
const MiniToken = "此处填写你获取的 miniToken";

export function getMiniToken(): string {
    if (!/^WHITE.+/.test(MiniToken)) {
        throw new Error("请将 2.0.0/src/Token.ts 文件中的 MiniToken 变量进行替换");
    }
    return MiniToken;
}
