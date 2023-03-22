const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let audioCtx, source, analyser, bufferLength, dataArray;

audio.addEventListener('canplaythrough', () => {
  audioCtx = new AudioContext();
  source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
});

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = '#f1f1f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4CAF50';
  ctx.beginPath();
  const sliceWidth =(bufferLength * 1.0) / canvas.width;
let x = 0;
for (let i = 0; i < bufferLength; i++) {
const v = dataArray[i] / 128.0;
const y = (v * canvas.height) / 2;
if (i === 0) {
ctx.moveTo(x, y);
} else {
ctx.lineTo(x, y);
}
x += sliceWidth;
}
ctx.stroke();
}

playBtn.addEventListener('click', () => {
audio.play();
draw();
});

stopBtn.addEventListener('click', () => {
audio.pause();
audio.currentTime = 0;
ctx.clearRect(0, 0, canvas.width, canvas.height);
});
