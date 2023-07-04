
import { EventEmitter, WebSocketServer, WebSocket, Event as OpenEvent, MessageEvent, CloseEvent } from 'ws';

import { IncomingMessage } from "http";
import { SocketMessage, MessageType, WebSocketClient } from "./Modals";

export function messageWorker(imsg: SocketMessage, wsName: string, wsChanne: string, socket: WebSocket, wsClientList: Array<WebSocketClient>) {
    switch (imsg.type) {
        case MessageType.HEALTH:
            var rep = new SocketMessage(MessageType.HEALTHRESPONSE, "LUhFQUxUSC1PSy0=", wsName);
            socket.send(JSON.stringify(rep));
            console.log(`Response Sent to  ${wsName} : ${"-HEALTH-OK-"}`);
            break;


        case MessageType.REQUEST:
            let fclient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
            if(fclient){
                fclient.ws.send(JSON.stringify(imsg));
                console.log(`Request Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
            }else{
                var rep = new SocketMessage(MessageType.RESPONSE, "Request Failed, Destination Not Found!", wsName);
                socket.send(JSON.stringify(rep));
                console.log(`Response Sent to  ${wsName} : Request Failed, Destination Not Found!`);
            }
            break;

        case MessageType.BROADCAST:
        // var blist = [...wsClients.keys()].filter((c) => { return c !== wsID });
        // console.log(`Input Message will be broadcasted to ${wsClients.size - 1} : ${blist.join(",")}`);
        // wsClients.forEach((client: WebSocket.WebSocket, clientID: string) => {

        //     if (wsID !== clientID) {

        //         var rep = new SocketOutputMessage(MessageType.RESPONSE, imsg.message, clientID, wsID);
        //         client.send(JSON.stringify(rep));
        //         console.log(`Response Sent to  ${clientID} : ${imsg.message}`);
        //     }
        // });
        default:
            break;
    }
}