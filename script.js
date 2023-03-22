const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');

const audioContext = new AudioContext();
const audioSrc = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();
audioSrc.connect(analyser);
analyser.connect(audioContext.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  
  ctx.beginPath();
  
  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;
  
  for(var i = 0; i < bufferLength; i++) {
  var v = dataArray[i] / 128.0;
  var y = v * canvas.height/2;
  if(i === 0) {
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
  }
  
  x += sliceWidth;
}

ctx.stroke();
}

playBtn.addEventListener('click', function() {
audio.play();
this.classList.add('playing');
draw();
});
stopBtn.addEventListener('click', function() {
audio.pause();
audio.currentTime = 0;
ctx.clearRect(0, 0, canvas.width, canvas.height);
playBtn.classList.remove('playing');
});
