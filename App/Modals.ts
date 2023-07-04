
import {WebSocket} from "ws";
export class SocketMessage{
    type: string;
    message: string;
    destination: string;
    origin:string;
    correlationID: string | null = null;
    integrity: string | null = null;

    constructor(_type: string, _message: string, _destination: string, _origin: string = "server"){
        this.type = _type;
        this.message = _message;
        this.destination = _destination;
        this.origin = _origin;
    }
   
}


export class WebSocketClient{
    name: string; 
    mtype: string;
    channel: string;
    ws: WebSocket;
    constructor(name: string, mtype: string, channel: string, ws: WebSocket){
        this.name = name;
        this.mtype = mtype;
        this.channel = channel;
        this.ws = ws;
    }
}

export enum MessageType{
    HEALTH = "health",
    HEALTHRESPONSE = "healthresponse",
    //input types
    REQUEST = "request",
    BROADCAST = "broadcast",
    //output types
    RESPONSE = "response"
}