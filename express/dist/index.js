"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var webSrv = (0, express_1.default)();
var httpSrv = http_1.default.createServer(webSrv);
var wsSrv = new socket_io_1.Server(httpSrv);
webSrv.get("/bonjour/:prenom", function (req, res) {
    var txt = "Bonjour " + req.params["prenom"];
    res.send(txt);
});
webSrv.get("/sources/:file", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "public", req.params['file']));
});
wsSrv.on("connection", function (socket) {
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
httpSrv.listen(port, function () {
    console.log("Serveur en \u00E9coute sur " + port + " ...");
});
