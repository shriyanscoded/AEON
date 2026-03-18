const testImg = new Image();
testImg.src = '/public/frames/ezgif-frame-001.jpg';
testImg.onload = () => console.log("✅ Image path works!");
testImg.onerror = () => console.log("❌ Image not found - path is wrong");

const canvas = document.getElementById("seq-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 90;

const frames = [];
for (let i = 1; i <= 90; i++) {
  const num = String(i).padStart(3, '0');
  frames.push(`/public/frames/ezgif-frame-${num}.jpg`);
}

console.log("Total frames:", frames.length);
console.log("First frame:", frames[0]);
console.log("Last frame:", frames[frames.length - 1]);

const images = [];
let loadedCount = 0;

function drawFirstFrame() {
  if (images[0]) {
    // Basic scaling to cover the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
  }
}

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = frames[i];
  images.push(img);

  img.onload = () => {
    loadedCount++;
    console.log(`Loaded ${loadedCount}/${frameCount} frames`);
    
    // Draw the first frame on the canvas when the page loads
    // Specifically when the first frame loads, we draw it right away
    if (i === 0) {
      drawFirstFrame();
    }
    
    if (loadedCount === frameCount) {
      console.log("Aeon ready");

      // Scroll container height
      const scrollContainer = document.getElementById('scroll-container');

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScroll;
        
        // Map scroll fraction to frame index
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        );
        
        // Draw the current frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);

        updateOverlays(scrollFraction);
      });
    }
  };
}

// Ensure resize updates canvas bounds and re-draws the frame
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFirstFrame();
});

function updateOverlays(fraction) {
  // text-1: visible 0-20%
  document.getElementById('text-1').style.opacity =
    fraction < 0.20 ? 1 : 0;

  // text-2: visible 30-50%
  document.getElementById('text-2').style.opacity =
    fraction > 0.30 && fraction < 0.50 ? 1 : 0;

  // text-3: visible 55-75%
  document.getElementById('text-3').style.opacity =
    fraction > 0.55 && fraction < 0.75 ? 1 : 0;

  // cta-card: visible 82-100%
  document.getElementById('cta-card').style.opacity =
    fraction > 0.82 ? 1 : 0;
}
