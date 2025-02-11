let micActive = false;
let silenceThreshold = 0.02;  // Define a threshold for silence
let animationRunning = false;

async function initMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function() {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;

      for (let i = 0; i < array.length; i++) {
        values += array[i];
      }

      const average = values / array.length;

      // Check if the sound level is below the threshold
      if (average < silenceThreshold * 100) {
        document.getElementById('mic-status').textContent = 'Silent - Animation Playing!';
        if (!animationRunning) {
          startAnimation();
        }
      } else {
        document.getElementById('mic-status').textContent = 'Noise detected';
        stopAnimation();
      }
    };
  } catch (err) {
    console.error('Microphone initialization failed:', err);
  }
}

function startAnimation() {
  animationRunning = true;
  // Your animation logic (e.g., play a gif or show some graphics)
  const container = document.getElementById('animation-container');
  container.innerHTML = '<div class="ball"></div>';  // Example animation
}

function stopAnimation() {
  animationRunning = false;
  const container = document.getElementById('animation-container');
  container.innerHTML = '';  // Clear animation
}

// Initialize the microphone on page load
window.onload = initMicrophone;
