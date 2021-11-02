import process from 'process';
import {
    IArgsParser,
    ArgsParser
} from "./ArgsParser";

const argsParser: IArgsParser = new ArgsParser(process.argv)

if (argsParser.isServer()) {
    const port: number = argsParser.getListeningPort()
    console.log(`Try listening on 127.0.0.1:${port}`)
}
else {
    const addr: string | false = argsParser.getAddress()
    if (addr) {
        console.log(`Vous voulez pinguer l'adresse "${addr}"`)
    } else {
        console.error("Merci de fournir une adresse IPv4 correcte à pinguer")
    }
}