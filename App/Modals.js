"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberType = exports.MessageType = exports.WebSocketClient = exports.SocketMessage = void 0;
class SocketMessage {
    constructor(_type, _message, _destination, _origin = "server") {
        this.correlationID = null;
        this.integrity = null;
        this.type = _type;
        this.message = Buffer.from(_message, 'utf8').toString('base64');
        ;
        this.destination = _destination;
        this.origin = _origin;
    }
    getMessage() {
        return Buffer.from(this.message, 'base64').toString('utf8');
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
    MessageType["LISTPEER"] = "listpeer";
    MessageType["PEERLIST"] = "peerlist";
    MessageType["REQUEST"] = "request";
    MessageType["BROADCAST"] = "broadcast";
    //output types
    MessageType["RESPONSE"] = "response";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MemberType;
(function (MemberType) {
    MemberType["SLAVE"] = "SLAVE";
    MemberType["MASTER"] = "MASTER";
})(MemberType = exports.MemberType || (exports.MemberType = {}));
