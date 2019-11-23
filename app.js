const BOT_ONE_TYPE_COUNT = 8;
const BOT_CLONE_COUNT = 8;
const BOT_WITH_MUTATION_COUNT = 1;
const MAX_LOOPS = 300; //20;
const LOOP_DELAY = 30; //0,1 second

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
let world;
let loops = 1;
let interval;

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
                    drawCell(j, i, "#f90");
                    break;
                case POINT_TYPE_BOT:
                    drawCell(j, i, "blue");
                    break;
                default:
                    drawCell(j, i, "#ccc");
            }
        }
    }
    context.stroke();
}

// --------------------------------

function init() {
    world = new World([
        "00000000000000000000000000000000000000000000000000".split(""),
        "00000000000000000000000000000000000000000000000000".split(""),
        "0000P0000000000000000000000000000000000000000P0000".split(""),
        "00000000000000000000000000000000000000000000000000".split(""),
        "000000000X000000000000000000000000000000X000000000".split(""),
        "000000000X00000000000000EE00000000000000X000000000".split(""),
        "000000000X000000000000000000000000000000X000000000".split(""),
        "000000000X00000000000000XX00000000000000X000000000".split(""),
        "000000000000000E00000000XX00000000E000000000000000".split(""),
        "000000000000000000000000XX000000000000000000000000".split(""),
        "000000000000000000000000XX000000000000000000000000".split(""),
        "000000000000000E00000000XX00000000E000000000000000".split(""),
        "000000000X00000000000000XX00000000000000X000000000".split(""),
        "000000000X000000000000000000000000000000X000000000".split(""),
        "000000000X00000000000000EE00000000000000X000000000".split(""),
        "000000000X000000000000000000000000000000X000000000".split(""),
        "00000000000000000000000000000000000000000000000000".split(""),
        "0000P0000000000000000000000000000000000000000P0000".split(""),
        "00000000000000000000000000000000000000000000000000".split(""),
        "00000000000000000000000000000000000000000000000000".split("")
    ]);

    for (i = 0; i < BOT_ONE_TYPE_COUNT; i++) {
        // 200 //const initGenom = [59, 0, 54, 62, 9, 49, 16, 39, 27, 20, 20, 52, 9, 8, 45, 35, 13, 10, 8, 34, 2, 41, 8, 10, 50, 31, 6, 6, 20, 29, 40, 23, 30, 10, 11, 45, 26, 35, 2, 15, 22, 31, 54, 1, 44, 12, 5, 0, 14, 0, 4, 41, 57, 8, 44, 25, 7, 56, 44, 53, 42, 36, 4, 12];
        // 500 //const initGenom = [59, 0, 54, 62, 9, 49, 16, 39, 27, 20, 20, 52, 9, 8, 45, 35, 13, 10, 8, 34, 2, 41, 8, 10, 50, 31, 6, 6, 20, 29, 40, 23, 30, 10, 11, 45, 26, 35, 2, 15, 22, 31, 54, 1, 44, 12, 5, 0, 14, 0, 4, 41, 57, 8, 44, 25, 7, 56, 44, 46, 42, 36, 4, 12];
        // 800 //const initGenom = [9, 0, 54, 62, 39, 49, 16, 39, 27, 20, 20, 52, 9, 8, 45, 35, 13, 10, 8, 34, 2, 41, 8, 10, 50, 34, 21, 6, 20, 29, 40, 23, 30, 10, 11, 45, 26, 35, 2, 15, 22, 31, 54, 1, 44, 12, 3, 0, 14, 0, 4, 41, 57, 8, 44, 25, 7, 56, 44, 46, 50, 36, 4, 12];
        // 950 //const initGenom = [9, 0, 26, 62, 53, 49, 54, 3, 27, 20, 20, 52, 9, 8, 45, 35, 13, 10, 16, 34, 2, 41, 8, 10, 50, 34, 21, 6, 55, 29, 40, 23, 30, 10, 11, 45, 26, 35, 2, 15, 22, 31, 54, 1, 24, 12, 11, 0, 14, 0, 56, 41, 57, 8, 44, 25, 7, 56, 44, 46, 50, 36, 4, 12];
        // 1200+
        const initGenom = [47, 58, 26, 38, 22, 4, 54, 12, 27, 18, 11, 54, 25, 57, 45, 25, 31, 45, 11, 7, 2, 31, 41, 37, 10, 14, 21, 32, 45, 15, 56, 46, 30, 10, 22, 13, 26, 35, 2, 15, 16, 2, 54, 1, 62, 13, 11, 55, 14, 0, 56, 41, 5, 8, 44, 38, 6, 36, 52, 46, 27, 51, 12, 24];
        const bot = new Bot(initGenom);

        for (j = 0; j < BOT_CLONE_COUNT; j++) {
            const point = world.getFreePoint();

            point.type = POINT_TYPE_BOT;
            world.addBot(new BotInfo(bot.clone(j === BOT_CLONE_COUNT - BOT_WITH_MUTATION_COUNT), point));
        }
    }

    world.generation = 1;
    drawBoard();
}

function loop() {
    world.processing();

    // context.clearRect(0, 0, canvas.width, canvas.height);
    // drawBoard();
    drawMap();

    loops++;

    if (loops % 5 === 0) {
        world.addToMap(POINT_TYPE_POISON);
    }
    if (loops % 1 === 0) {
        world.addToMap(POINT_TYPE_EAT);
        world.addToMap(POINT_TYPE_EAT);
    }

    if (interval) {
        clearInterval(interval);
    }
    if (world._maxAge < 5000) {
        interval = setInterval(function () {
            loop();
        }, LOOP_DELAY);
    } else {
        console.log("optimal genom:", world._maxAgeGenom.join(', '));
    }
}

init();
loop();



