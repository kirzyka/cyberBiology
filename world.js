const WORLD_SIZE_W = 50;
const WORLD_SIZE_H = 20;
const WORLD_CELL_SIZE = 20;
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
        // stats
        this._generation = 0;
        this._maxAge = 0;
    }

    get map() {
        return this._map;
    }

    get bots() {
        return this._bots;
    }

    get generation() {
        return this._generation;
    }

    set generation(value) {
        this._generation = value;
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
            col = getRandomInt(0, WORLD_SIZE_W - 1);
            row = getRandomInt(0, WORLD_SIZE_H - 1);
            vacant = !this.isFreeCell(col, row);
        } while (vacant);

        return new Point(col, row);
    }

    processing() {
        this._bots = this._bots
            .map((botInfo) => {
                if (botInfo.bot.health < 1) {
                    this.removeFromMap(botInfo.point);
                }
                return botInfo;
            })
            .filter((botInfo) => botInfo.bot.health > 0); // remove death bots

        // new generation
        if (this._bots.length === BOT_ONE_TYPE_COUNT) {
            
            // calc stats
            let genMaxAge = 0;
            this._bots.map((botInfo) => {
                this._maxAge = Math.max(this._maxAge, botInfo.bot.age);
                genMaxAge = Math.max(genMaxAge, botInfo.bot.age);
            });

            console.log('----------------------------');
            console.log('world maxAge:', this._maxAge);
            console.log('gen maxAge:', genMaxAge);
            console.log('-> new generation:', this._generation);
            console.log('loops:', loops);


            for (i = this._bots.length - 1; i > -1; i--) {
                const bot = this._bots[i].bot;
                for (j = 0; j < BOT_CLONE_COUNT - 1; j++) {
                    const point = world.getFreePoint();

                    point.type = POINT_TYPE_BOT;
                    world.addBot(new BotInfo(bot.clone(j === BOT_CLONE_COUNT - 1 - BOT_WITH_MUTATION_COUNT), point));
                }
            }
            this._generation++;
            loops = 0;
        }

        // process
        for (i = 0; i < this._bots.length; i++) {
            const botInfo = this._bots[i];
            const bot = botInfo.bot;

            let stepCount = 0;

            do {
                const cmd = bot.genom[bot.cmdPos];
                let targetPointType;

                if (cmd < 8) { // move       
                    targetPointType = this.moveBot(cmd, botInfo, i);
                    this.updateBotCmdPos(bot, targetPointType);
                    bot.updateHealth();
                    if (targetPointType === POINT_TYPE_POISON) {
                        bot.updateHealth(-bot.health);
                    } else if (targetPointType === POINT_TYPE_EAT) {
                        bot.updateHealth(WORLD_EAT_VALUE);
                    }                    
                    stepCount = 10;
                } else if (cmd < 15) { // get 
                    targetPointType = this.getFromCell(cmd, botInfo, i);
                    this.updateBotCmdPos(bot, targetPointType);
                    bot.updateHealth();
                    stepCount = 10;
                } else if (cmd < 23) { // look 
                    targetPointType = this.lookAtCell(cmd, botInfo, i);
                    this.updateBotCmdPos(bot, targetPointType);
                    bot.updateHealth();
                    stepCount++;
                } else if (cmd < 31) { // rotation 
                    botInfo.bot.rotate(cmd);
                    bot.updateCmdPos();
                    bot.updateHealth();
                    stepCount++;
                } else { // goto
                    bot.updateCmdPos(cmd);
                    bot.updateHealth();
                    stepCount++;
                }
            } while (stepCount < 10 && bot.health > 0)

            bot.age = bot.age + 1;

            const healthyBotsCount = this._bots.filter((botInfo) => botInfo.bot.health > 0).length;

            if (healthyBotsCount === BOT_ONE_TYPE_COUNT) {
                return;  // init new generation     
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

        if (targetCol > -1 && targetRow > -1 && targetCol < WORLD_SIZE_W && targetRow < WORLD_SIZE_H) {
            const targetPoint = this._map[targetRow][targetCol];

            if ([POINT_TYPE_EAT, POINT_TYPE_POISON, POINT_TYPE_EMPTY].includes(targetPoint)) {
                botInfo.point = new Point(targetCol, targetRow, POINT_TYPE_BOT);
                this.update(new Point(oldCol, oldRow), botInfo.point);
            }
            return targetPoint;
        }
        return POINT_TYPE_WALL;
    }

    getFromCell(cmd, botInfo, idx) {
        const bot = botInfo.bot;
        const point = botInfo.point;
        const moveIdx = (cmd + bot.rotation) % 8;
        const targetCol = point.col + WORLD_MOVES[moveIdx].col;
        const targetRow = point.row + WORLD_MOVES[moveIdx].row;

        if (targetCol > -1 && targetRow > -1 && targetCol < WORLD_SIZE_W && targetRow < WORLD_SIZE_H) {
            const targetPoint = this._map[targetRow][targetCol];

            if ([POINT_TYPE_EAT, POINT_TYPE_POISON].includes(targetPoint)) {
                bot.updateHealth(WORLD_EAT_VALUE);
                this.removeFromMap(new Point(targetCol, targetRow));
            }

            return targetPoint;
        }
        return POINT_TYPE_WALL;
    }

    lookAtCell(cmd, botInfo, idx) {
        const bot = botInfo.bot;
        const point = botInfo.point;
        const moveIdx = (cmd + bot.rotation) % 8;
        const targetCol = point.col + WORLD_MOVES[moveIdx].col;
        const targetRow = point.row + WORLD_MOVES[moveIdx].row;

        if (targetCol > -1 && targetRow > -1 && targetCol < WORLD_SIZE_W && targetRow < WORLD_SIZE_H) {
            const targetPoint = this._map[targetRow][targetCol];

            return targetPoint;
        }
        return POINT_TYPE_WALL;
    }

    updateBotCmdPos(bot, cellType) {
        switch (cellType) {
            case POINT_TYPE_POISON:
                bot.updateCmdPos();
                break;
            case POINT_TYPE_EAT:
                bot.updateCmdPos(2);
                break;
            case POINT_TYPE_WALL:
                bot.updateCmdPos(3);
                break;
            case POINT_TYPE_BOT:
                bot.updateCmdPos(4);
                break;
            default:
                bot.updateCmdPos(5);
        }
    }
}