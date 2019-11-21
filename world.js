const WORLD_SIZE_W = 20;
const WORLD_SIZE_H = 10;
const WORLD_CELL_SIZE = 40;
const WORLD_W = WORLD_SIZE_W * WORLD_CELL_SIZE;
const WORLD_H = WORLD_SIZE_H * WORLD_CELL_SIZE;
const WORLD_P = 10;
const WORLD_EAT_VALUE = 10;
const WORLD_MOVES = [
    { col: -1, row: -1 },
    { col: 0, row: -1 },
    { col: 1, row: -1 },
    { col: 1, row: 0 },
    { col: 1, row: 1 },
    { col: 0, row: 1 },
    { col: -1, row: 1 },
    { col: -1, row: 0 }
];

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

    addToMap(type, point) {
        point = point || this.getFreePoint();

        this._map[point.row][point.col] = type;
    }

    removeFromMap(point) {
        this._map[point.row][point.col] = POINT_TYPE_EMPTY;
    }

    isFreeCell(col, row, types) {
        types = types || [POINT_TYPE_EMPTY];

        return types.includes(this._map[row][col])
    }

    getFreePoint() {
        let col = 0;
        let row = 0;
        let vacant = true;
    
        do {
            col = getRandomInt(0, 19);
            row = getRandomInt(0, 9);
            vacant = !this.isFreeCell(col, row);
        } while (vacant);
    
        return new Point(col, row);
    }

    processing() {
        this._bots = this._bots.filter((botInfo) => botInfo.bot.health > 0); // remove death bots

        if (this._bots.length < BOT_ONE_TYPE_COUNT + 1) {
            for (i = this._bots.length -1; i > -1; i--) {
                const bot = this._bots[i].bot;
                for (j = 0; j < BOT_CLONE_COUNT; j++) {
                    const point = world.getFreePoint();
        
                    point.type = POINT_TYPE_BOT;
                    world.addBot(new BotInfo(bot.clone(j === BOT_CLONE_COUNT - BOT_WITH_MUTATION_COUNT), point));
                }
            }
        } 

        for (i = 0; i < this._bots.length; i++) {
            const botInfo = this._bots[i];
            const bot = botInfo.bot;
            const cmd = bot.genom[bot.cmdPos];
    
            if (cmd < 8) { // move       
                this.moveBot(cmd, botInfo, i);   
                bot.updateCmdPos();
            } else if (cmd < 15) { // get 
                this.getFromCell(cmd, botInfo, i);
                bot.updateCmdPos();
            } else if (cmd < 23) { // look 
                // ....
                bot.updateCmdPos();
                bot.updateHealth();
            } else if (cmd < 31) { // rotation 
                botInfo.bot.rotate(cmd);
                bot.updateCmdPos();
                bot.updateHealth();
            } else { // goto
                bot.cmdPos = (bot.cmdPos + cmd) % 64
            }
            
        }
    }
    
    moveBot(cmd, botInfo, idx) {
        const bot = botInfo.bot;
        const point = botInfo.point;
        const moveIdx = (cmd + bot.rotation) % 8;
        const oldCol = point.col;
        const oldRow = point.row;
        const targetCol = point.col + WORLD_MOVES[moveIdx].col;
        const targetRow = point.row + WORLD_MOVES[moveIdx].row;
    
        if (targetCol > -1 && targetRow > -1 && targetCol < WORLD_SIZE_W && targetRow < WORLD_SIZE_H
            && this.isFreeCell(targetCol, targetRow, [POINT_TYPE_EMPTY, POINT_TYPE_POISON, POINT_TYPE_EAT])) {

            botInfo.point = new Point(targetCol, targetRow, POINT_TYPE_BOT);
            bot.updateHealth();
            if (bot.health === 0) {
                this.removeFromMap(botInfo.point);
            }            
            this.update(new Point(oldCol, oldRow), botInfo.point);
        }
    }

    getFromCell(cmd, botInfo, idx) {
        const bot = botInfo.bot;
        const point = botInfo.point;
        const moveIdx = (cmd + bot.rotation) % 8;
        const targetCol = point.col + WORLD_MOVES[moveIdx].col;
        const targetRow = point.row + WORLD_MOVES[moveIdx].row;

        if (targetCol > -1 && targetRow > -1 && targetCol < WORLD_SIZE_W && targetRow < WORLD_SIZE_H) {
            const cellContent = this._map[targetRow][targetCol];

            if (cellContent === POINT_TYPE_POISON) {
                bot.health = 0;
                this.removeFromMap(new Point(targetCol, targetRow));
            }

            if (cellContent === POINT_TYPE_EAT) {
                bot.updateHealth(WORLD_EAT_VALUE);
                this.removeFromMap(new Point(targetCol, targetRow));
            }
        }

    }
}