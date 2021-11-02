"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var isServer = process_1.default.argv.indexOf('server') !== -1;
if (isServer) {
}
// client
else if (process_1.default.argv.length > 2) {
    var address = process_1.default.argv[2];
    console.log(address);
}
else {
    console.error("Merci de préciser une adresse.");
}
// console.log( isServer );
