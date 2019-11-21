class World {
    
    constructor(map) {
        this._map = map; // string[][]
        this._bots = []; // botInfo[]
    }

    get map() {
        return this._map;
    }

    get bots() {
        return this._bots;
    }

    update(oldPoint, newPoint) {
        this._map[oldPoint.row][oldPoint.col] = POINT_TYPE_EMPTY;
        this._map[newPoint.row][newPoint.col] = newPoint.type;
    }

    addBot(botInfo) {
        this._bots.push(botInfo);
        this._map[botInfo.point.row][botInfo.point.col] = POINT_TYPE_BOT;
    }

    addEat() {
        const point = this.getFreePoint();

        this._map[point.row][point.col] = POINT_TYPE_EAT;
    }

    addPoison() {
        const point = this.getFreePoint();

        this._map[point.row][point.col] = POINT_TYPE_POISON;
    }

    getFreePoint() {
        let col = 0;
        let row = 0;
        let vacant = true;
    
        do {
            col = getRandomInt(0, 19);
            row = getRandomInt(0, 9);
            vacant = ![POINT_TYPE_EMPTY].includes(this._map[row][col]);
        } while (vacant);
    
        return new Point(col, row);
    }
}