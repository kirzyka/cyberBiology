class BotInfo {
    constructor (bot, point) {
        this._bot = bot;
        this._point = point;
    }

    get bot() {
        return this._bot;
    }

    set bot(value) {
        this._bot = value;
    }

    get point() {
        return this._point;
    }

    set point(value) {
        this._point = value;
    }
}