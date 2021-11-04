import { IRoom } from "./Room";

export interface IRoomCollection extends Iterator<IRoom> {
    /**
     * Liste des identifiants des salons
     *
     * @type {Array<string>}
     * @memberof IRoomCollection
     */
    readonly all: Array<string>
    /**
     * Récupération des données d'un salon dont l'identifiant est `id`
     *
     * @param {string} id
     * @returns {(IRoom | false)}
     * @memberof IRoomCollection
     */
    get (id: string): IRoom | false
    /**
     * Ajoute un salon aux salons connus de cette collection
     *
     * @param {IRoom} room
     * @memberof IRoomCollection
     */
    add (room: IRoom): void
    /**
     * Supprime de cette collection un salon avec l'identifiant `id` donné
     *
     * @param {string} id
     * @memberof IRoomCollection
     */
    del (id: string): void
}

export class Rooms implements IRoomCollection {
    private _rooms: { [k: string]: IRoom }
    private _ids: Array<string>
    private _nextIdx: number

    constructor() {
        this._rooms = {}
        this._ids = []
        this._nextIdx = 0
    }

    get all (): Array<string> { return this._ids }
    set all (_v: Array<string>) {}

    get (id: string): IRoom | false {
        if (id in this._rooms) {
            return this._rooms[id]
        }
        return false
    }

    add (room: IRoom): void {
        if (!(room.id in this._rooms)) {
            this._ids.push(room.id)
        }
    }

    del (id: string) {
        this._ids = this._ids.filter((idCourant: string) => idCourant != id)

        if(id in this._rooms) {
            delete this._rooms[id]
        }
    }

    next (...args: Array<any>): { value: IRoom, done?: false } | { value: undefined, done: true } {
        if (this._nextIdx < this._ids.length) {
            const ret: { value: IRoom, done: false }
                = { value: this._rooms[this._ids[this._nextIdx]], done: false }
            this._nextIdx++
            return { value: undefined, done: true }
        }
        this._nextIdx = 0
        return { value: undefined, done: true }
    }
}