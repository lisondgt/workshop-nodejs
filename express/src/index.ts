import path from "path"
import http from "http"
import express from "express"
import {
    IWSServer,
    WSServer
} from "./WSServer"

const webSrv = express()
const httpSrv = http.createServer(webSrv)
const wsSrv: IWSServer = new WSServer({httpSrv})

webSrv.get("/bonjour/:prenom", (req, res) => {
    const txt = `Bonjour ${req.params["prenom"]}`
    res.send(txt)
})

webSrv.get("/chat/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", req.params['file']))
})

const port: number = 8080
httpSrv.listen(port, () => {
    console.log(`Serveur en écoute sur ${port} ...`)
})