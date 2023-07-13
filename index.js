"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Modals_1 = require("./App/Modals");
const MessageWorker_1 = require("./App/MessageWorker");
const PORT = 5000;
const wsServer = new ws_1.WebSocketServer({
    port: PORT
});
let wsClientList = new Array();
// function getUniqueID(){
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return s4() + s4() + '-' + s4();ndklfngl
// };
wsServer.on('connection', (socket, request) => {
    let fullURL = new URL(request.url.trim(), "ws://create.url");
    let name = fullURL.pathname.substring(1);
    let mtype = fullURL.searchParams.get('type') === "MASTER" ? Modals_1.MemberType.MASTER : Modals_1.MemberType.SLAVE;
    let channel = fullURL.searchParams.get('channel');
    if (!wsClientList.find(c => c.name === name && c.mtype === mtype && c.channel === channel)) {
        wsClientList.push(new Modals_1.WebSocketClient(name, mtype, channel, socket));
        console.log(`A client just connected : [${channel}]-${name}-${mtype}`);
        socket.onopen = (event) => {
            console.log("socket opened");
        };
        socket.onclose = (ee) => {
            let loc = wsClientList.findIndex(c => c.name === name && c.mtype === mtype && c.channel === channel);
            if (loc !== -1) {
                console.log(wsClientList.splice(loc, 1) ? `[ Disconnected ] Client Disconnected [${channel}]-${name}-${mtype}` : null);
            }
            console.log("Connected sockets: " + wsClientList.map(cl => `${cl.channel}-${cl.name}`).join(","));
        };
        socket.onmessage = (me) => {
            console.log(`Recevied from ${name} : ${me.data.toString()}`);
            var imsg;
            try {
                imsg = JSON.parse(me.data.toString());
                (0, MessageWorker_1.messageWorker)(imsg, name, channel, socket, wsClientList);
            }
            catch (error) {
                var rep = new Modals_1.SocketMessage("response", "wrong format", name);
                socket.send(JSON.stringify(rep));
                console.log(`[ ERROR ] Wrong Format Received from ${name} : Wrong Format Response sent`);
            }
        };
    }
    else {
        var rep = new Modals_1.SocketMessage("response", "Client Already Exists!", name);
        socket.send(JSON.stringify(rep));
        socket.close(1003, "Client Already Exists!");
    }
});
console.log((new Date()) + " Websocket Server is listening on port " + PORT);
