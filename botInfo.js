class BotInfo {
    constructor (bot, point) {
        this._bot = bot;
        this._point = point;
    }

    get bot() {
        return this._bot;
    }

    get point() {
        return this._point;
    }
}