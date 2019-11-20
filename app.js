
var bw = 800;
var bh = 400;
var p = 10;
var cellSize = 40;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var bots = [];


function drawBoard(){
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
    context.fillRect(p + (col * cellSize) + 0.5,  p + (row * cellSize) + 0.5, cellSize, cellSize);
}

function drawBots() {
    for (i = 0; i < bots.length; i++) {
        const botInfo = bots[i];
        drawCell(botInfo.col, botInfo.row, "blue");
    }
}

function getFreePos() {
    let pos = {col: 0, row: 0};
    let free = true;

    do {
        pos.col = getRandomInt(0, 19);
        pos.row = getRandomInt(0, 9);
        free = bots.some((botInfo) => pos.col === botInfo.col && pos.row === botInfo.row);
    } while (free);
    
    return pos;
}

function init() {
    for (i = 0; i < 5; i++) {
        const bot = new Bot();
        let pos;
        for (j = 0; j < 4; j++) {
            pos = getFreePos();
            console.log(pos);
            bots.push({bot: bot.clone(), col: pos.col, row: pos.row});
        }
        pos = getFreePos();
        console.log('m', pos);
        bots.push({bot: bot.clone(true), col: pos.col, row: pos.row});
    }
}


init();
console.log(bots);

context.clearRect(0, 0, canvas.width, canvas.height);
drawBoard();
drawBots();
