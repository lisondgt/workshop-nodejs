"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var Users = /** @class */ (function () {
    function Users() {
        this._users = {};
        this._ids = [];
        this._nextIdx = 0;
    }
    Object.defineProperty(Users.prototype, "all", {
        get: function () { return this._ids; },
        set: function (_v) { },
        enumerable: false,
        configurable: true
    });
    Users.prototype.get = function (id) {
        if (id in this._users) {
            return this._users[id];
        }
        return false;
    };
    Users.prototype.add = function (user) {
        if (!(user.id in this._users)) {
            this._ids.push(user.id);
        }
    };
    Users.prototype.del = function (id) {
        this._ids = this._ids.filter(function (idCourant) { return idCourant != id; });
        if (id in this._users) {
            delete this._users[id];
        }
    };
    Users.prototype.next = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._nextIdx < this._ids.length) {
            var ret = { value: this._users[this._ids[this._nextIdx]], done: false };
            this._nextIdx++;
            return { value: undefined, done: true };
        }
        this._nextIdx = 0;
        return { value: undefined, done: true };
    };
    return Users;
}());
exports.Users = Users;
