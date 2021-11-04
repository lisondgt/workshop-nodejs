import * as net from "net";
import {IServer} from "./Server";

export interface IClientConfig {
    /**
     * Adresse du serveur à pinguer
     *
     * @type {string}
     * @memberof IClientConfig
     */
    readonly address: string
    /**
     * Port du serveur à pinguer
     *
     * @type {number}
     * @memberof IClientConfig
     */
    readonly port: number
    /**
     * Méthode custom optionnelle de log (Idem que serveur)
     *
     * @memberof IClientConfig
     */
    readonly log?: (...args: Array<any>) => void
    /**
     * Méthode custom optionnelle d'erreur (Idem que serveur)
     *
     * @memberof IClientConfig
     */
    readonly error?: (...args: Array<any>) => void
}

export interface IClient {
    /**
     * Ping un serveur.
     * Récupère un temps de début en millisecondes
     * Se connecte à un serveur, lui envoit la chaine "PING", et attends de recevoir la réponse ("PONG")
     * Récupère un temps de fin en millisecondes
     * Renvoie la durée du ping (fin - début)
     *
     * @returns {(Promise<number | false>)}
     * @memberof IClient
     */
    ping (): Promise<number | false>
}

export class Client implements IClient {
    private port: number;
    private address: string;
    private connexion: net.Socket


    constructor(config: IClientConfig) {
        this.port = config.port;
        this.address = config.address;
        this.connexion = net.createConnection(this.port, this.address);
    }

    ping(): Promise<number | false> {
        const start = Date.now();
        this.connexion.write("PING");
        return new Promise((resolve: (value: number) => void, reject: (value: false) => void) => {
            this.connexion.on('data', (data) => {
                if (data.toString() === "PONG") {
                    const end = Date.now()
                    resolve(end - start)
                }
                else {
                    reject(false)
                }
            })
        })
    }
}