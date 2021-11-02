import * as net from "net";

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