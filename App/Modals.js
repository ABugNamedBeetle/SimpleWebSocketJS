"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.SocketOutputMessage = exports.SocketInputMessage = void 0;
class SocketInputMessage {
    constructor(_type, _message) {
        this.type = _type;
        this.message = _message;
    }
}
exports.SocketInputMessage = SocketInputMessage;
class SocketOutputMessage {
    constructor(_type, _message, _destination, _origin = "server") {
        this.type = _type;
        this.message = _message;
        this.destination = _destination;
        this.origin = _origin;
    }
}
exports.SocketOutputMessage = SocketOutputMessage;
var MessageType;
(function (MessageType) {
    MessageType["HEALTH"] = "health";
    //input types
    MessageType["BROADCAST"] = "broadcast";
    //output types
    MessageType["RESPONSE"] = "response";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
