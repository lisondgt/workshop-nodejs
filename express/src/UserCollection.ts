import type { IUser } from "./User"

export interface IUserCollection extends Iterator<IUser> {
    /**
     * Liste des identifiants des utilisateurs
     *
     * @type {Array<string>}
     * @memberof IUsers
     */
    readonly all: Array<string>
    /**
     * Récupération des données d'un utilisateur dont l'identifiant est `id`
     *
     * @param {string} id
     * @returns {(IUser | false)}
     * @memberof IUsers
     */
    get (id: string): IUser | false
    /**
     * Ajoute un utilisateur aux utilisateurs connus de cette collection
     *
     * @param {IUser} user
     * @memberof IUsers
     */
    add (user: IUser): void
    /**
     * Supprime de cette collection un utilisateur avec l'identifiant `id` donné
     *
     * @param {string} id
     * @memberof IUserCollection
     */
    del (id: string): void
}

export class Users implements IUserCollection {
    private _users: { [k: string]: IUser }
    private _ids: Array<string>
    private _nextIdx: number

    constructor() {
        this._users = {}
        this._ids = []
        this._nextIdx = 0
    }

    get all (): Array<string> { return this._ids }
    set all (_v: Array<string>) {}

    get (id: string): IUser | false {
        if (id in this._users) {
            return this._users[id]
        }
        return false
    }

    add (user: IUser): void {
        if (!(user.id in this._users)) {
            this._ids.push(user.id)
        }
    }

    del (id: string) {
        this._ids = this._ids.filter((idCourant: string) => idCourant != id)

        if(id in this._users) {
            delete this._users[id]
        }
    }

    next (...args: Array<any>): { value: IUser, done?: false } | { value: undefined, done: true } {
        if (this._nextIdx < this._ids.length) {
            const ret: { value: IUser, done: false }
            = { value: this._users[this._ids[this._nextIdx]], done: false }
            this._nextIdx++
            return { value: undefined, done: true }
        }
        this._nextIdx = 0
        return { value: undefined, done: true }
    }
}