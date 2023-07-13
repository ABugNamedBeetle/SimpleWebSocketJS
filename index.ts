import { EventEmitter, WebSocketServer, WebSocket, Event as OpenEvent, MessageEvent, CloseEvent, CLOSED } from 'ws';

import { IncomingMessage } from "http";
import { SocketMessage, MessageType, WebSocketClient, MemberType } from "./App/Modals";
import { messageWorker } from "./App/MessageWorker"

const PORT: number = 5000;
const wsServer = new WebSocketServer({
    port: PORT
})

let wsClientList = new Array<WebSocketClient>();

// function getUniqueID(){
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return s4() + s4() + '-' + s4();ndklfngl
// };

wsServer.on('connection', (socket: WebSocket, request: IncomingMessage) => {

    let fullURL = new URL(request.url!.trim(), "ws://create.url");
    let name = fullURL.pathname.substring(1);
    let mtype = fullURL.searchParams.get('type')! === "MASTER" ? MemberType.MASTER : MemberType.SLAVE;
    let channel = fullURL.searchParams.get('channel')!;
    
   
    
    if (!wsClientList.find(c => c.name === name && c.mtype === mtype && c.channel === channel) ) {

        wsClientList.push(new WebSocketClient(name, mtype, channel, socket));

        console.log(`A client just connected : [${channel}]-${name}-${mtype}`);

        socket.onopen = (event: OpenEvent) => {
            console.log("socket opened");

        }
        socket.onclose = (ee: CloseEvent) => {

            let loc: number = wsClientList.findIndex(c => c.name === name && c.mtype === mtype && c.channel === channel);
            if (loc !== -1) {
                console.log(wsClientList.splice(loc, 1) ? `[ Disconnected ] Client Disconnected [${channel}]-${name}-${mtype}` : null)
            }
            console.log("Connected sockets: " + wsClientList.map(cl => `${cl.channel}-${cl.name}`).join(","));
        }

        socket.onmessage = (me: MessageEvent) => {
            console.log(`Recevied from ${name} : ${me.data.toString()}`);
            var imsg: SocketMessage;
            try {
                imsg = <SocketMessage> JSON.parse(me.data.toString());
                messageWorker(imsg, name, channel, socket, wsClientList);
            } catch (error) {
                var rep = new SocketMessage("response", "wrong format", name);
                socket.send(JSON.stringify(rep));
                console.log(`[ ERROR ] Wrong Format Received from ${name} : Wrong Format Response sent`);
            }
        }
    } else {


        var rep = new SocketMessage("response", "Client Already Exists!", name);
        socket.send(JSON.stringify(rep));
        socket.close(1003, "Client Already Exists!");
    }


});


console.log((new Date()) + " Websocket Server is listening on port " + PORT);

