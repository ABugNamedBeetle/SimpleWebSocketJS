
import { EventEmitter, WebSocketServer, WebSocket, Event as OpenEvent, MessageEvent, CloseEvent } from 'ws';

import { IncomingMessage } from "http";
import { SocketMessage, MessageType, WebSocketClient, MemberType, MessageSubType } from "./Modals";

export function messageWorker(imsg: SocketMessage, wsName: string, wsChanne: string, socket: WebSocket, wsClientList: Array<WebSocketClient>) {
    
    
    
    switch (imsg.type) {
        case MessageType.HEALTH:
            var hrep = new SocketMessage(MessageType.HEALTHRESPONSE, "-HEALTH-OK-", wsName);
            messageSender(hrep, socket, "HEALTH RESPONSE");
            break;


        case MessageType.REQUEST:

            switch (imsg.subType) {

                case MessageSubType.LISTPEER:
                    let slaveNames = JSON.stringify(findSlaveOnChannel().map(s => s.name));
                    let sm = new SocketMessage(MessageType.RESPONSE, slaveNames, wsName)
                                 .setMessageSubType(MessageSubType.PEERLIST);
                    messageSender(sm, socket, "PEER LIST RESPONSE");
                    break;


                case MessageSubType.CREATESESSION:
                    {
                        let salveClient = findSlaveWithName(imsg.destination);
                        if (salveClient) {
                            messageSender(imsg, salveClient.ws, "CREATE SESSION REQUEST");
                            
                        } else {
                            var failedRep = new SocketMessage(MessageType.RESPONSE, "Create Session Request Failed, Destination Not Found!", wsName);
                            messageSender(failedRep, socket, "CREATE SESSION REQUEST : FAILED")
                         }
                    }
                    break;
                case MessageSubType.SESSIONHEALTH: {
                    let salveClient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
                    if (salveClient) {
                        salveClient.ws.send(JSON.stringify(imsg));// the REQUEST packet will be sent to SLAVE as it is
                        console.log(`Session Health Request Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
                    } else {
                        var rep = new SocketMessage(MessageType.RESPONSE, "Session Health Request Failed, Destination Not Found!", wsName);
                        socket.send(JSON.stringify(rep));
                        console.log(`Response Sent to  ${wsName} : Session Health Request Failed, Destination Not Found!`);
                    }
                }
                    break;

                default: {

                    let salveClient = findSlaveWithName(imsg.destination);
                        if (salveClient) {
                            messageSender(imsg, salveClient.ws, "REQUEST");
                            
                        } else {
                            var failedRep = new SocketMessage(MessageType.RESPONSE, "Request Failed, Destination Not Found!", wsName);
                            messageSender(failedRep, socket, "REQUEST : FAILED")
                         }
                    break;
                }

            }

            break;


        case MessageType.RESPONSE:
            {
                switch (imsg.subType) {

                    case MessageSubType.SESSIONCREATED: {
                        let masterClient = wsClientList.find(c => c.name === imsg.destination && c.channel === wsChanne);
                        if (masterClient) {
                            masterClient.ws.send(JSON.stringify(imsg));// the session created response from slave
                            console.log(`Session Created Response Sent to ${imsg.destination} from ${wsName} on [${wsChanne}]`);
                        } else {
                            var rep = new SocketMessage(MessageType.RESPONSE, "Session Created Response Failed, Destination Not Found!", wsName);
                            socket.send(JSON.stringify(rep));
                            console.log(`Response Sent to  ${wsName} : Session Created Response Failed, Destination Not Found!`);
                        }
                        break;
                    }
                }

                break;
            }


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

        function findSlaveWithName(slavename: string){
            return wsClientList.find(c => c.name === slavename && c.channel === wsChanne);
        }

        function findSlaveOnChannel(){
            return wsClientList.filter(c => c.channel === wsChanne && c.mtype === MemberType.SLAVE);
        }

        function messageSender(sm: SocketMessage, rsock: WebSocket , logPrefix: string){
            let strmsg = JSON.stringify(sm);
            rsock.send(strmsg);
            console.log(`[ ${logPrefix} ] Sent from ${sm.origin} to ${sm.destination} on ${wsChanne} :`);
            console.log(sm);
        }
}