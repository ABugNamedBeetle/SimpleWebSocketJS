import WebSocket, { EventEmitter } from "ws";
import {IncomingMessage} from "http"; 
import { SocketInputMessage,SocketOutputMessage,MessageType } from "./App/Modals";

const PORT:number = 5000;
const wsServer = new WebSocket.Server({
    port: PORT
})

let wsClients = new Map<string, WebSocket.WebSocket>();

// function getUniqueID(){
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return s4() + s4() + '-' + s4();ndklfngl
// };

wsServer.on('connection',(socket: WebSocket.WebSocket, request: IncomingMessage)=>{
    let wsID: string = request.url?.trim().substring(1)!;
    console.log(`A client just connected : ${wsID}` );
    if(!wsClients.has(wsID)){
    
        wsClients.set(wsID, socket);
    }
    
    socket.onopen = (event: WebSocket.Event)=>{
        console.log("socket opened"); 
        
    }
    socket.onmessage = (me: WebSocket.MessageEvent)=>{
        console.log("Recevied from "+ wsID+" : "+ me.data.toString());
        var imsg:SocketInputMessage;
        try {
             imsg = <SocketInputMessage> JSON.parse(me.data.toString());
             messageWorker(imsg, wsID, socket);
        } catch (error) {
            var rep  = new SocketOutputMessage("response","wrong format",wsID);
            socket.send(JSON.stringify(rep));
            console.log(`[ ERROR ] Wrong Format Received from ${wsID} : Wrong Format Response sent to ${wsID}`);
        }

       
        
        // if(me.data.toString() === "-ok-"){
        //     //only reply to sender
        //     socket.send(me.data);

        // }else{

        //     wsClients.forEach((client: WebSocket.WebSocket, clientID: string)=>{
        //         client.onclose
                
        //         if(wsID !== clientID ){
        //             console.log(`Message sent from ${wsID} to ${clientID} : ${me.data}` )
        //             client.send(me.data);
        //         }
        //     });
        // }        
            

    }

    
    socket.onclose = (ee: WebSocket.CloseEvent)=>{
        
       if(wsClients.has(wsID)){
            console.log( wsClients.delete(wsID) ? `${wsID} disconnected`: null)
       }
       console.log("Connected sockets: " + [...wsClients.keys()].join(","));
       
    }

});


console.log( (new Date()) + " Websocket Server is listening on port " + PORT);

function messageWorker(imsg: SocketInputMessage, wsID: string, socket: WebSocket.WebSocket){
    switch (imsg.type) {
        case MessageType.HEALTH:
            var rep  = new SocketOutputMessage(MessageType.RESPONSE,"-HEALTH-OK-",wsID);
            socket.send(JSON.stringify(rep));
            console.log(`Response Sent to  ${wsID} : ${"-HEALTH-OK-"}`);
            break;
    
        case MessageType.BROADCAST:
            var blist = [...wsClients.keys()].filter((c)=>{return c !== wsID });
            console.log(`Input Message will be broadcasted to ${wsClients.size-1} : ${blist.join(",")}`);
            wsClients.forEach((client: WebSocket.WebSocket, clientID: string)=>{
                                              
                        if(wsID !== clientID ){
                            
                            var rep  = new SocketOutputMessage(MessageType.RESPONSE,imsg.message,clientID, wsID);
                            client.send(JSON.stringify(rep));
                            console.log(`Response Sent to  ${clientID} : ${imsg.message}`);
                        }
                    });   
        default:
            break;
    }
}