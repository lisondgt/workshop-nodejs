"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
var socket_io_1 = require("socket.io");
var UserCollection_1 = require("./UserCollection");
var WSServer = /** @class */ (function () {
    function WSServer(config) {
        this.server = new socket_io_1.Server(config.httpSrv);
        this.onlineUsers = new UserCollection_1.Users();
        this.server.on("connection", function (socket) {
            console.log("Un utilisateur s'est connecté");
            socket.on("chat", function (reason) {
                console.log("Utilisateur deconnecté");
                if (reason) {
                    console.log("pour la raison suivante \"" + (reason) + "\"");
                }
            });
            socket.on("chat", function (msg) {
                console.log("Message du canal chat: \"" + msg + "\"");
                socket.emit("chat", "Vous avez \u00E9crit \"" + msg + "\"");
            });
        });
        var port = 8080;
        config.httpSrv.listen(port, function () {
            console.log("Serveur en \u00E9coute sur " + port + " ...");
        });
    }
    return WSServer;
}());
exports.WSServer = WSServer;
