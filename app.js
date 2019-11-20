
const bw = 800;
const bh = 400;
const p = 10;
const cellSize = 40;
const botCount = 5;
const botCloneCount = 5;
const MAX_LOOPS = 100; //20;
const delayInMilliseconds = 1000; //1 second

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var bots = [];
var loops = 1;

function drawBoard() {
    for (var x = 0; x <= bw; x += cellSize) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += cellSize) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }
    context.strokeStyle = "black";
    context.stroke();
}

function drawCell(col, row, color) {
    context.fillStyle = color;
    context.fillRect(p + (col * cellSize) + 0.5, p + (row * cellSize) + 0.5, cellSize, cellSize);
}

function drawBots() {
    for (i = 0; i < bots.length; i++) {
        const botInfo = bots[i];
        drawCell(botInfo.col, botInfo.row, "blue");
    }
}

function getFreePos() {
    let pos = { col: 0, row: 0 };
    let free = true;

    do {
        pos.col = getRandomInt(0, 19);
        pos.row = getRandomInt(0, 9);
        free = bots.some((botInfo) => pos.col === botInfo.col && pos.row === botInfo.row);
    } while (free);

    return pos;
}

function init() {
    for (i = 0; i < botCount; i++) {
        const bot = new Bot();
        for (j = 0; j < botCloneCount; j++) {
            const pos = getFreePos();
            bots.push({ bot: bot.clone(j === 4), col: pos.col, row: pos.row, comm: 0 });
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
    processing();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawBots();

    loops++;

    if (loops !== MAX_LOOPS) {
        setTimeout(function () {
            loop();
        }, delayInMilliseconds);
    }
}

init();
loop();



