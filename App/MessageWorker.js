"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageWorker = void 0;
const Modals_1 = require("./Modals");
function messageWorker(imsg, wsName, wsChanne, socket, wsClientList) {
    switch (imsg.type) {
        case Modals_1.MessageType.HEALTH:
            var rep = new Modals_1.SocketMessage(Modals_1.MessageType.HEALTHRESPONSE, "-HEALTH-OK-", wsName);
            socket.send(JSON.stringify(rep));
            console.log(`Response Sent to  ${wsName} : ${"-HEALTH-OK-"}`);
            break;
        case Modals_1.MessageType.REQUEST:
            let fclient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
            if (fclient) {
                fclient.ws.send(JSON.stringify(imsg));
                console.log(`Request Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
            }
            else {
                var rep = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, "Request Failed, Destination Not Found!", wsName);
                socket.send(JSON.stringify(rep));
                console.log(`Response Sent to  ${wsName} : Request Failed, Destination Not Found!`);
            }
            break;
        case Modals_1.MessageType.BROADCAST:
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
exports.messageWorker = messageWorker;
