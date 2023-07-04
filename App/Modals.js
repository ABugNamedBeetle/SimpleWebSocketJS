"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.WebSocketClient = exports.SocketMessage = void 0;
class SocketMessage {
    constructor(_type, _message, _destination, _origin = "server") {
        this.correlationID = null;
        this.integrity = null;
        this.type = _type;
        this.message = _message;
        this.destination = _destination;
        this.origin = _origin;
    }
}
exports.SocketMessage = SocketMessage;
class WebSocketClient {
    constructor(name, mtype, channel, ws) {
        this.name = name;
        this.mtype = mtype;
        this.channel = channel;
        this.ws = ws;
    }
}
exports.WebSocketClient = WebSocketClient;
var MessageType;
(function (MessageType) {
    MessageType["HEALTH"] = "health";
    MessageType["HEALTHRESPONSE"] = "healthresponse";
    //input types
    MessageType["REQUEST"] = "request";
    MessageType["BROADCAST"] = "broadcast";
    //output types
    MessageType["RESPONSE"] = "response";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
