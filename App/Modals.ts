
import {WebSocket} from "ws";
export class SocketMessage{
    type: string;
    subType: MessageSubType = MessageSubType.EMPTY;
    message: string; //always encoded
    destination: string;
    origin:string;
    correlationID: string | null = null;
    integrity: string | null = null;

    constructor(_type: string, _message: string, _destination: string, _origin: string = "server"){
        this.type = _type;
        this.message = Buffer.from(_message, 'utf8').toString('base64');;
        this.destination = _destination;
        this.origin = _origin;
    }

    setMessageSubType(sub: MessageSubType){
        this.subType = sub;
        return this;
    }
    


    getMessage(){
        return Buffer.from(this.message, 'base64').toString('utf8');
    }
   
}


export class WebSocketClient{
    name: string; 
    mtype: string;
    channel: string;
    ws: WebSocket;
    constructor(name: string, mtype: MemberType, channel: string, ws: WebSocket){
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
   
     //peer health
    BROADCAST = "broadcast",
    //output types
    RESPONSE = "response"
}

export enum     MessageSubType{
    //reuests
    CREATESESSION = "createsession", //create sesison with peer in message type
   
    PEERLIST="peerlist",
    
    //response
    SESSIONCREATED = "sessioncreated",
    LISTPEER="listpeer",

    //neural
    SESSIONHEALTH = "sessionhealth", 
    EMPTY = "empty"
}

export enum MemberType{
    SLAVE = "SLAVE",
    MASTER = "MASTER"
}