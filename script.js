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
    
    // Update loader progress
    const percent = Math.round(
      (loadedCount / frameCount) * 100
    );
    document.getElementById('loader-bar')
      .style.width = percent + '%';
    document.getElementById('loader-percent')
      .textContent = percent + '%';

    if (loadedCount === frameCount) {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        const content = document.getElementById('loader-content');
        
        // Fade out content first
        content.style.transition = 'opacity 0.6s ease';
        content.style.opacity = '0';
        
        // Then fade out entire loader
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            drawFirstFrame();
            updateOverlays(0); // Trigger first text instantly
            
            // Fade in navbar after loader
            const navbar = document.getElementById('navbar');
            navbar.style.transition = 'opacity 1s ease';
            navbar.style.opacity = '1';
          }, 1200);
        }, 400);
        
      }, 300);
      
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
  toggleOverlay('text-1', 
    fraction < 0.20);

  // text-2: visible 30-50%
  toggleOverlay('text-2', 
    fraction > 0.30 && fraction < 0.50);

  // text-3: visible 55-75%
  toggleOverlay('text-3', 
    fraction > 0.55 && fraction < 0.75);

  // cta-card: visible 82-100%
  toggleOverlay('cta-card', 
    fraction > 0.82);
}

function toggleOverlay(id, isVisible) {
  const el = document.getElementById(id);
  if (isVisible) {
    el.classList.add('visible');
  } else {
    el.classList.remove('visible');
  }
}
