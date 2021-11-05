import http from "http"
import {
    Server as SocketIOServer,
    Socket
} from "socket.io"
import { IUserCollection, Users } from "./UserCollection";
import { User } from "./User";
import { IRoomCollection, Rooms } from "./RoomCollection";
import { Room } from "./Room";
import { Message } from "./Message";
import { v4 as uuidv4 } from "uuid";

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

export class WSServer implements IWSServer {

    private readonly _httpServer: http.Server
    private _socketioServer: SocketIOServer
    private _users: IUserCollection
    private _rooms: IRoomCollection
    room1: Room

    constructor(config:IWSServerConfig) {
        this._httpServer = config.httpSrv
        this._socketioServer = new SocketIOServer(this._httpServer)
        this._users = new Users()
        this._rooms = new Rooms()
        this.room1 = new Room({ id: uuidv4(), title: 'Accueil', usersCollection: this.onlineUsers });
        this._rooms.add(this.room1);

        this._start();
    }

    private _start (): void {

        let room2 = new Room({ id: uuidv4(), title: 'Room 2', usersCollection: this.onlineUsers, urlImage: 'default-image.jpg' });
        this._rooms.add(room2);

        // let user1 = new User({ id: user.id, pseudo: 'John Doe', collection: this.onlineUsers, imgUrl: 'default-image.jpg' });
        // this._users.add(user1);

        this.server.on("connection", (socket: Socket) => {

            socket.on('_handleUsers', (pseudo: string) => this._handleUsers(socket,pseudo));

            socket.on('_handleChat', (msg: any) => this._handleChat(socket,msg));

            socket.on('_handleRooms', (selectedRoom: string) => this._handleRooms(socket,selectedRoom))

        })

    }

    get server (): SocketIOServer { return this._socketioServer }
    set server (_v: SocketIOServer) {}

    get onlineUsers (): IUserCollection { return this._users }
    set onlineUsers (_v: IUserCollection) {}

    get rooms (): IRoomCollection { return this._rooms }
    set rooms (_v: IRoomCollection) {}

    private _handleChat (socket: Socket, msg: any): void {
        let user = this.onlineUsers.get(socket.id);
        let room = this.rooms.get(msg.selectedRoom);

        if (user && room) {
            let message = new Message(msg.msg, user,room.id);
            this.server.to(room.id).emit('chat', { msg: message, user: { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl } })
        }
    }

    private _handleUsers (socket: Socket, pseudo: string): void {
        let user = new User({ pseudo, id: socket.id, collection: this.onlineUsers, imgUrl: 'default-image.jpg' });
        this.onlineUsers.add(user);
        this.room1.joinUser(user.id);

        socket.join(this.room1.id);

        this.server.to(this.room1.id).emit('logged', { user: { pseudo }, timer: Date.now(),selectedRoom:this.room1.id });
        socket.emit('initRooms', this.rooms.all.map (id => {
            let room = this.rooms.get(id);
            if (room) {
                return { id: room.id, title: room.title, urlImage: room.urlImage };
            }
        }));
        socket.emit('initUsers', this.room1.joinedUsers.map(id => {
            let user = this.onlineUsers.get(id);
            if (user) {
                return { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl };
            }
        }));
    }

    private _handleRooms (socket: Socket, selectedRoom:string): void {
        let room = this.rooms.get(selectedRoom);
        let user = this.onlineUsers.get(socket.id);

        if (room && user) {
            room.joinUser(user.id);
            socket.join(room.id);
            socket.emit('initUsers', room.joinedUsers.map(id => {
                let user = this.onlineUsers.get(id);
                if (user) {
                    return { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl };
                }
            }))
        }
    }

}