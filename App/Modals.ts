export class SocketInputMessage{
    type: MessageType;
    message: string;

    constructor(_type: MessageType, _message: string){
        this.type = _type;
        this.message = _message;
    }
}

export class SocketOutputMessage{
    type: string;
    message: string;
    destination: string;
    origin:string;

    constructor(_type: string, _message: string, _destination: string, _origin: string = "server"){
        this.type = _type;
        this.message = _message;
        this.destination = _destination;
        this.origin = _origin;
    }
   
}

export enum MessageType{
    HEALTH = "health",
    //input types
    BROADCAST = "broadcast",
    //output types
    RESPONSE = "response"
}