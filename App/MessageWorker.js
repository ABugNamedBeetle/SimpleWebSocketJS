"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageWorker = void 0;
const Modals_1 = require("./Modals");
function messageWorker(imsg, wsName, wsChanne, socket, wsClientList) {
    switch (imsg.type) {
        case Modals_1.MessageType.HEALTH:
            var hrep = new Modals_1.SocketMessage(Modals_1.MessageType.HEALTHRESPONSE, "-HEALTH-OK-", wsName);
            messageSender(hrep, socket, "HEALTH RESPONSE");
            break;
        case Modals_1.MessageType.REQUEST:
            switch (imsg.subType) {
                case Modals_1.MessageSubType.LISTPEER:
                    let slaveNames = JSON.stringify(findSlaveOnChannel().map(s => s.name));
                    let sm = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, slaveNames, wsName)
                        .setMessageSubType(Modals_1.MessageSubType.PEERLIST);
                    messageSender(sm, socket, "PEER LIST RESPONSE");
                    break;
                case Modals_1.MessageSubType.CREATESESSION:
                    {
                        let salveClient = findSlaveWithName(imsg.destination);
                        if (salveClient) {
                            messageSender(imsg, salveClient.ws, "CREATE SESSION REQUEST");
                        }
                        else {
                            var failedRep = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, "Create Session Request Failed, Destination Not Found!", wsName);
                            messageSender(failedRep, socket, "CREATE SESSION REQUEST : FAILED");
                        }
                    }
                    break;
                case Modals_1.MessageSubType.SESSIONHEALTH:
                    {
                        let salveClient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
                        if (salveClient) {
                            salveClient.ws.send(JSON.stringify(imsg)); // the REQUEST packet will be sent to SLAVE as it is
                            console.log(`Session Health Request Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
                        }
                        else {
                            var rep = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, "Session Health Request Failed, Destination Not Found!", wsName);
                            socket.send(JSON.stringify(rep));
                            console.log(`Response Sent to  ${wsName} : Session Health Request Failed, Destination Not Found!`);
                        }
                    }
                    break;
                default: {
                    let salveClient = findSlaveWithName(imsg.destination);
                    if (salveClient) {
                        messageSender(imsg, salveClient.ws, "REQUEST");
                    }
                    else {
                        var failedRep = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, "Request Failed, Destination Not Found!", wsName);
                        messageSender(failedRep, socket, "REQUEST : FAILED");
                    }
                    break;
                }
            }
            break;
        case Modals_1.MessageType.RESPONSE:
            {
                switch (imsg.subType) {
                    case Modals_1.MessageSubType.SESSIONCREATED: {
                        let masterClient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
                        if (masterClient) {
                            masterClient.ws.send(JSON.stringify(imsg)); // the session created response from slave
                            console.log(`Session Created Response Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
                        }
                        else {
                            var rep = new Modals_1.SocketMessage(Modals_1.MessageType.RESPONSE, "Session Created Response Failed, Destination Not Found!", wsName);
                            socket.send(JSON.stringify(rep));
                            console.log(`Response Sent to  ${wsName} : Session Created Response Failed, Destination Not Found!`);
                        }
                        break;
                    }
                }
                break;
            }
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
    function findSlaveWithName(slavename) {
        return wsClientList.find(c => c.name === slavename && c.channel === wsChanne);
    }
    function findSlaveOnChannel() {
        return wsClientList.filter(c => c.channel === wsChanne && c.mtype === Modals_1.MemberType.SLAVE);
    }
    function messageSender(sm, rsock, logPrefix) {
        let strmsg = JSON.stringify(sm);
        rsock.send(strmsg);
        console.log(`[ ${logPrefix} ] Sent from ${sm.origin} to ${sm.destination} on ${wsChanne} :`);
        console.log(sm);
    }
}
exports.messageWorker = messageWorker;
