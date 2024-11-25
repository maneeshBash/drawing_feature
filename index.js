const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let drawing = false;
let lastX = 0;
let lastY = 0;
let currentBrushSize = 2;
let currentColor = "#000000";
let drawingHistory = [];
let currentHistoryIndex = -1;

const colorPicket = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const undoBtn = document.getElementById("undoBtn");

colorPicket.addEventListener("input", (e) => {
  currentColor = e.target.value;
});
brushSize.addEventListener("input", (e) => {
  currentBrushSize = e.target.value;
});

function startDrawing(e) {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!drawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentBrushSize;
  ctx.lineCap = "round";
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  saveDrawingState();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory = [];
  currentHistoryIndex = -1;
}

function saveDrawing() {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "drawing.png";
  link.click();
}
function undoDrawing() {
  if (currentHistoryIndex <= 0) return;
  currentHistoryIndex--;
  const lastState = drawingHistory[currentHistoryIndex];
  ctx.putImageData(lastState, 0, 0);
}
function saveDrawingState() {
  if (currentHistoryIndex < drawingHistory.length - 1) {
    drawingHistory = drawingHistory.slice(0, currentHistoryIndex + 1);
  }
  drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  currentHistoryIndex++;
}

function stopDrawing() {
  drawing = false;
}
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

clearBtn.addEventListener("click", clearCanvas);
saveBtn.addEventListener("click", saveDrawing);
undoBtn.addEventListener("click", undoDrawing);
