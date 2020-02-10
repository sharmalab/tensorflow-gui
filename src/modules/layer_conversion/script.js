// "./" must be required to load json from sub path
//const modelP = tf.loadModel("./model.json");
const modelP = tf.loadModel("./model.json");

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 28 * 8;
canvas.style.display = "block";
canvas.style.borderStyle = "solid";
//canvas.style.backgroundColor = "white";
document.body.appendChild(canvas);

// simple scribble
const c2d = canvas.getContext("2d");
c2d.lineWidth = 8;
c2d.strokeStyle = "black";
c2d.fillStyle = "white";
let prev = null;
canvas.addEventListener(
  "mousedown",
  ev => {
    prev = ev;
  },
  false
);
canvas.addEventListener(
  "mouseup",
  ev => {
    prev = null;
  },
  false
);
canvas.addEventListener(
  "mousemove",
  ev => {
    if (prev === null) return;
    const bounds = canvas.getBoundingClientRect();
    c2d.beginPath();
    c2d.moveTo(prev.clientX - bounds.left, prev.clientY - bounds.top);
    c2d.lineTo(ev.clientX - bounds.left, ev.clientY - bounds.top);
    c2d.stroke();
    prev = ev;
    predict().catch(console.error);
  },
  false
);

// NOTE: white filling is required: tf.fromPixel() ignores alpha channel
function clear() {
  c2d.fillRect(0, 0, canvas.width, canvas.height);
}
clear();
const clearButton = document.createElement("button");
clearButton.style.display = "block";
clearButton.textContent = "clear";
clearButton.addEventListener("click", clear, false);
document.body.appendChild(clearButton);

// for result
const pre = document.createElement("pre");
document.body.appendChild(pre);

// apply trained keras model
async function predict() {
  const model = await modelP;
  const img = c2d.getImageData(0, 0, canvas.width, canvas.height);
  // tf.tidy(): auto-release block ([NOTE] tf.keep(t): avoid auto-release)
  tf.tidy(() => {
    // data.shape == [28, 28, 3], value: 0(black)-255(color)
    const data = tf.image.resizeBilinear(tf.fromPixels(img), [28, 28]);
    const r = data.slice([0, 0, 0], [data.shape[0], data.shape[1], 1]);
    const g = data.slice([0, 0, 1], [data.shape[0], data.shape[1], 1]);
    const b = data.slice([0, 0, 2], [data.shape[0], data.shape[1], 1]);
    // input.shape == [n, 28, 28, 1], value: 0(white)-1(black)
    const input = r
      .add(g)
      .add(b)
      .cast("float32")
      .div(tf.scalar(-1 * 3 * 255))
      .add(tf.scalar(1))
      .reshape([1, 28, 28, 1]);
    const result = model.predict(input);
    // result.shape == [n, 10], value: 0-1 (as categorical probability)

    // display result
    const probs = [...result.buffer().values];
    const num = result.argMax(1).buffer().values[0];
    pre.textContent = [`predict number: ${num}`]
      .concat(probs.map((p, n) => `${n} = ${p}`))
      .join("\n");
  });
}
$("#my-button").click(function() {
  $("#my-file").click();
});
