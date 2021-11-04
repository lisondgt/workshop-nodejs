import http from "http"
import {
    Server as SocketIOServer,
    Socket
} from "socket.io"
import { IUserCollection, Users } from "./UserCollection";
import { IRoomCollection, Rooms } from "./RoomCollection";

export interface IWSServerConfig {
    /**
     * Instance du Serveur HTTP renvoyé par http.createServer()
     *
     * @type {http.Server}
     * @memberof IWSServerConfig
     */
    httpSrv: http.Server
    /**
     * Eventuelle fonctione de log customisée.
     * Si aucune fonction n'est fournie, utiliser console.log
     *
     * @memberof IWSServerConfig
     */
    log?: (...args: Array<any>) => void
}

export interface IWSServer {
    /**
     * Instance du serveur renvoyé par Socket.IO
     *
     * @type {SocketIOServer}
     * @memberof IWSServer
     */
    readonly server: SocketIOServer
    /**
     * Liste des utilisateurs en ligne
     *
     * @type {IUserCollection}
     * @memberof IWSServer
     */
    readonly onlineUsers: IUserCollection
    /**
     * Liste des salons connus du serveur
     *
     * @type {IRoomCollection}
     * @memberof IWSServer
     */
    readonly rooms: IRoomCollection
}

export interface IMsg {
    /**
     * Horodatage du moment ou le serveur reçoit le message
     */
    readonly timestamp?: number
    /**
     * Identifiant de l'utilisateur envoyant le message
     */
    readonly userId?: string
    /**
     * Identifiant du salon dans lequel le message est envoyé
     */
    readonly roomId?: string
    /**
     * Contenu du message
     */
    readonly msg: string
}

export class WSServer implements IWSServer {

    private readonly _httpServer: http.Server
    private _socketioServer: SocketIOServer
    // private _log: (...args: Array<any>) => void
    private _users: IUserCollection
    private _rooms: IRoomCollection

    constructor(config:IWSServerConfig) {
        this._httpServer = config.httpSrv
        this._socketioServer = new SocketIOServer(this._httpServer)
        // this._log = []
        this._users = new Users()
        this._rooms = new Rooms()
    }

    private _start (): void {
        this.server.on("connection", (socket: Socket) => {
            console.log("Un utilisateur s'est connecté")
            socket.on("chat", (reason: string) => {
                console.log("Utilisateur deconnecté")
                if(reason) {
                    console.log(`pour la raison suivante "${(reason)}"`)
                }
            })
            socket.on("chat", (msg: string) => {
                console.log(`Message du canal chat: "${msg}"`)
                socket.emit("chat", `Vous avez écrit "${msg}"`)
            })
        })
    }

    get server (): SocketIOServer { return this._socketioServer }
    set server (_v: SocketIOServer) {}

    get onlineUsers (): IUserCollection { return this._users }
    set onlineUsers (_v: IUserCollection) {}

    get rooms (): IRoomCollection { return this._rooms }
    set rooms (_v: IRoomCollection) {}

    // private _newUserRoom (adminId?: string): string {
    //
    // }

    private _newUser (id: string, roomId: string): void {

    }

    private _handleDisconnect (socket: Socket, reason?: string): void {

    }

    private _handleChat (socket: Socket, msg: IMsg): void {

    }

    private _handleUsers (socket: Socket, msg: IMsg): void {

    }

    private _handleRooms (socket: Socket, msg: IMsg): void {

    }

}