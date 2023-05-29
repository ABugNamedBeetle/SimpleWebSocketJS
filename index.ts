import express from "express";
import WebSocket, { EventEmitter } from "ws";
import {IncomingMessage} from "http"; 

const PORT:number = 5000;
const wsServer = new WebSocket.Server({
    port: PORT
})

let wsClients = new Map<string, WebSocket.WebSocket>();

// function getUniqueID(){
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return s4() + s4() + '-' + s4();
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
       
        if(me.data.toString() === "-ok-"){
            //only reply to sender
            socket.send(me.data);

        }else{

            wsClients.forEach((client: WebSocket.WebSocket, clientID: string)=>{
                client.onclose
                
                if(wsID !== clientID ){
                    console.log(`Message sent from ${wsID} to ${clientID} : ${me.data}` )
                    client.send(me.data);
                }
            });
        }        
            

    }

    
    socket.onclose = (ee: WebSocket.CloseEvent)=>{
        
       if(wsClients.has(wsID)){
            console.log( wsClients.delete(wsID) ? `${wsID} disconnected`: null)
       }
       console.log("Connected sockets: " + [...wsClients.keys()].join(","));
       
    }

});


console.log( (new Date()) + " Server is listening on port " + PORT);