"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(config) {
        this.id = config.id;
        this.pseudo = config.pseudo;
        this.imgUrl = config.imgUrl;
        this.collection = config.collection;
        this.rooms = [];
        this.collection.add(this);
    }
    User.prototype.joinRoom = function (roomId) {
        if (!(roomId in this.rooms)) {
            this.rooms.push(roomId);
        }
    };
    User.prototype.leaveRoom = function (roomId) {
        if (roomId in this.rooms) {
            this.rooms.splice(this.rooms.indexOf(roomId));
        }
    };
    return User;
}());
exports.User = User;
