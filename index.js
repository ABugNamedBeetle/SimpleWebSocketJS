"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const PORT = 5000;
const wsServer = new ws_1.default.Server({
    port: PORT
});
let wsClients = new Map();
// function getUniqueID(){
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return s4() + s4() + '-' + s4();
// };
wsServer.on('connection', (socket, request) => {
    var _a;
    let wsID = (_a = request.url) === null || _a === void 0 ? void 0 : _a.trim().substring(1);
    console.log(`A client just connected : ${wsID}`);
    if (!wsClients.has(wsID)) {
        wsClients.set(wsID, socket);
    }
    socket.onopen = (event) => {
        console.log("socket opened");
    };
    socket.onmessage = (me) => {
        console.log("Recevied from " + wsID + " : " + me.data.toString());
        if (me.data.toString() === "-ok-") {
            //only reply to sender
            socket.send(me.data);
        }
        else {
            wsClients.forEach((client, clientID) => {
                client.onclose;
                if (wsID !== clientID) {
                    console.log(`Message sent from ${wsID} to ${clientID} : ${me.data}`);
                    client.send(me.data);
                }
            });
        }
    };
    socket.onclose = (ee) => {
        if (wsClients.has(wsID)) {
            console.log(wsClients.delete(wsID) ? `${wsID} disconnected` : null);
        }
        console.log("Connected sockets: " + [...wsClients.keys()].join(","));
    };
});
console.log((new Date()) + " Server is listening on port " + PORT);
