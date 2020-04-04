const { contextBridge, ipcRenderer } = require("electron");
const promiseIpc = require('electron-promise-ipc');

contextBridge.exposeInMainWorld(
    "api", {
    promise: (channel, data, func) => {
        let validChannels = [
            "toMain",
            "test",
            "/comp",
            "/comp/id",
            "/comp/post",
            "/comp/delete",
            "/comp/update",
            "/session/comp",
            "/session/id/delete",
            "/session/post",
            "/session/put/name",
            "/match/id",
            "/match/session",
            "/match/post"
        ];
        if (validChannels.includes(channel)) {
            promiseIpc.send(channel, data).then((res) => { func(res) });
        } else {
            console.log(`[${channel}] is an invalide route!`);
        }
    }
}
);