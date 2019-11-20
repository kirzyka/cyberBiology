
var bw = 800;
var bh = 400;
var p = 10;
var cellSize = 40;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

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

context.clearRect(0, 0, canvas.width, canvas.height);
drawBoard();
drawCell(2, 4, "green");
