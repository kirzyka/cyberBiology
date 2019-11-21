
const WORLD_W = 800;
const WORLD_H = 400;
const WORLD_P = 10;
const WORLD_CELL_SIZE = 40;
const BOT_ONE_TYPE_COUNT = 1;
const BOT_CLONE_COUNT = 5;
const BOT_WITH_MUTATION_COUNT = 1;
const MAX_LOOPS = 100; //20;
const delayInMilliseconds = 1000; //1 second

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
let world;
let loops = 1;

function drawBoard() {
    for (var x = 0; x <= WORLD_W; x += WORLD_CELL_SIZE) {
        context.moveTo(0.5 + x + WORLD_P, WORLD_P);
        context.lineTo(0.5 + x + WORLD_P, WORLD_H + WORLD_P);
    }

    for (var x = 0; x <= WORLD_W; x += WORLD_CELL_SIZE) {
        context.moveTo(WORLD_P, 0.5 + x + WORLD_P);
        context.lineTo(WORLD_W + WORLD_P, 0.5 + x + WORLD_P);
    }
    context.strokeStyle = "black";
    context.stroke();
}

function drawCell(col, row, color) {
    context.fillStyle = color;
    context.fillRect(WORLD_P + (col * WORLD_CELL_SIZE) + 0.5, WORLD_P + (row * WORLD_CELL_SIZE) + 0.5, WORLD_CELL_SIZE, WORLD_CELL_SIZE);
}

function drawMap() {
    for (i = 0; i < world.map.length; i++) {
        const row = world.map[i];

        for (j = 0; j < row.length; j++) {
            switch (row[j]) {
                case POINT_TYPE_POISON:
                    drawCell(j, i, "red");
                    break;
                case POINT_TYPE_EAT:
                    drawCell(j, i, "green");
                    break;
                case POINT_TYPE_WALL:
                    drawCell(j, i, "grey");
                    break;
                case POINT_TYPE_BOT:
                    drawCell(j, i, "blue");
                    break;
            }
        }
    }
}

// --------------------------------

function init() {
    world = new World([
        "00000000000000000000".split(""),
        "00P00000000000000000".split(""),
        "000000000XX000000000".split(""),
        "000X00P00XX00000X000".split(""),
        "000X000000000000X000".split(""),
        "000X000000000000X000".split(""),
        "000X00000XX00000X000".split(""),
        "000000000XX000E00000".split(""),
        "000000000E0000000000".split(""),
        "00000000000000000000".split(""),
    ]);

    for (i = 0; i < BOT_ONE_TYPE_COUNT; i++) {
        const bot = new Bot();
        for (j = 0; j < BOT_CLONE_COUNT; j++) {
            const point = world.getFreePoint();

            point.type = POINT_TYPE_BOT;
            world.addBot(new BotInfo(bot.clone(j === BOT_CLONE_COUNT - BOT_WITH_MUTATION_COUNT), point));
        }
    }
}

function processing() {
    for (i = 0; i < bots.length; i++) {
        const botInfo = bots[i];
        const bot = botInfo.bot;
        const cmd = bot.genom[botInfo.comm];

        if (cmd < 8) { // move            
            moveBot(cmd, botInfo, i);
            bots[i].comm = (botInfo.comm + 1) % 64;
        } else {
            botInfo.comm = 0;
        }
        
    }
}

function moveBot(cmd, botInfo, idx) {
    const moves = [
        { col: -1, row: -1 },
        { col: 0, row: -1 },
        { col: 1, row: -1 },
        { col: 1, row: 0 },
        { col: 1, row: 1 },
        { col: 0, row: 1 },
        { col: -1, row: 1 },
        { col: -1, row: 0 }
    ];
    const newCol = botInfo.col + moves[cmd].col;
    const newRow = botInfo.row + moves[cmd].row;

    if (newCol > -1 && newRow > -1 && newCol < 20 && newRow < 10
        && bots.some((item) => item.col !== newCol && item.row !== newRow)
        && botInfo.bot.health > 0) {
        botInfo.col = newCol;
        botInfo.row = newRow;
        bots[idx] = botInfo;
    }
}

function loop() {
    console.log('loop', loops);

    //processing();
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawMap();

    loops++;

    //world.addEat();
    //world.addPoison();

    if (loops !== MAX_LOOPS) {
        setTimeout(function () {
            loop();
        }, delayInMilliseconds);
    }
}

init();
loop();



