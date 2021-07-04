let state = {
  width: 5,
  color: 'black',
  maxHeight: window.innerHeight * 0.6,
  maxWidth: window.innerWidth * 0.8,
  history: [],
  historyStep: -1,
  painting: false,
  src: "test-image.webp",
}

let img = new Image();

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let colorBtn = document.querySelector('#color');
colorBtn.addEventListener('change', () => {
  state.color = colorBtn.selectedOptions[0].value;
})

let sizeSelect = sizeForm.size;
sizeSelect.addEventListener("change", () => {
  state.width = +sizeSelect.selectedOptions[0].value;
})

let uploadBtn = document.querySelector('#myFile');
uploadBtn.addEventListener('change', () => {
  img = new Image();
  state.src = uploadBtn?.files[0]?.name;
  img.addEventListener('load', show());
})

show();

// *************** Displaying ***************

function show(src = state.src) {
  img.src = state.src;
  img.addEventListener('load', () => {
  state.history = [];
  renderImage();
  })
}


function renderImage() {
  img.height = (img.height > state.maxHeight) ? state.maxHeight : img.height;
  img.width = (img.width > state.maxWidth) ? state.maxWidth : img.width;
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  pushTohistory();
}

// *************** Drawing ***************

function startPosition(e) {
  state.painting = true;
  draw(e)
}

function finishedPosition() {
  state.painting = false;
  ctx.beginPath();
  pushTohistory();
}

function draw(e) {
  if (!state.painting) return;
  ctx.lineWidth = state.width;
  ctx.strokeStyle = state.color;
  ctx.lineCap = 'round';

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

// *************** drawHistory ***************

function clear() {
  let changedImg = new Image();
  changedImg.src = state.history[0];
  pushTohistory();
  changedImg.onload = function () { ctx.drawImage(changedImg, 0, 0); }
}


function undo() {
  if (state.historyStep > 0) {
    state.historyStep--;
    let changedImg = new Image();
    changedImg.src = state.history[state.historyStep];
    changedImg.onload = function () { ctx.drawImage(changedImg, 0, 0); }
  }
}

function redo() {
  if (state.historyStep < state.history.length - 1) {
    state.historyStep++;
    let changedImg = new Image();
    changedImg.src = state.history[state.historyStep];
    changedImg.onload = function () { ctx.drawImage(changedImg, 0, 0); }
  }
}

function pushTohistory() {
  state.historyStep++;
  if (state.historyStep < state.history.length) { state.history.length = state.historyStep; }
  state.history.push(document.querySelector('#canvas').toDataURL());
}

document.querySelector("#clear").addEventListener('click', clear);
document.querySelector("#undo").addEventListener('click', undo);
document.querySelector("#redo").addEventListener('click', redo);