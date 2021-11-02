import process from 'process';
import {
    IArgsParser,
    ArgsParser
} from "./ArgsParser";
import {
    IServer,
    Server
} from "./Server";

const argsParser: IArgsParser = new ArgsParser(process.argv)

if (argsParser.isServer()) {
    const listeningPort: number = argsParser.getListeningPort()
    console.log(`Try listening on 127.0.0.1:${listeningPort}`)
    const server: IServer = new Server({
        listeningPort,
        onData: (data: string) => {
            console.log(`Data: "${data}"`)
        }
    })
    server.listen()
    console.log(`Server listening on 127.0.0.1:${listeningPort}`)
} else {
    const addr: string | false = argsParser.getAddress()
    if (addr) {
        console.log(`Vous voulez pinguer l'adresse "${addr}"`)
    } else {
        console.error("Merci de fournir une adresse IPv4 correcte à pinguer")
    }
}