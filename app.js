const BOT_ONE_TYPE_COUNT = 8;
const BOT_CLONE_COUNT = 8;
const BOT_WITH_MUTATION_COUNT = 1;
const MAX_LOOPS = 300; //20;
const LOOP_DELAY = 100; //0,1 second

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
        const bot = new Bot();
        for (j = 0; j < BOT_CLONE_COUNT; j++) {
            const point = world.getFreePoint();

            point.type = POINT_TYPE_BOT;
            world.addBot(new BotInfo(bot.clone(j === BOT_CLONE_COUNT - BOT_WITH_MUTATION_COUNT), point));
        }
    }

    world.generation = 1;
}

function loop() {
    // console.log('loop', loops);

    world.processing();
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBoard();
    drawMap();
    
    loops++;

    if (loops % 5 === 0) {
        world.addToMap(POINT_TYPE_POISON);
    }
    if (loops % 2 === 0) {
        world.addToMap(POINT_TYPE_EAT);
    }

    if (world._maxAge < 1000) {
        setTimeout(function () {
            loop();
        }, LOOP_DELAY);
    }
}

init();
loop();



