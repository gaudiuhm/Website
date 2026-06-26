/* BACKGROUND */

const grid = document.getElementById('block-grid');

const cellSize = 36;
const maxDist = Math.sqrt(2) * 2;
const minScale = 0.01;
const maxScale = 1;
const decay = 0.01; 

const colors = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E', '#7F77DD', '#BA7517', '#639922'];

let cols, rows, blocks = [];
let mouseCol = -10, mouseRow = -10;

function buildGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  cols = Math.ceil(w / cellSize);
  rows = Math.ceil(h / cellSize);

  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

  blocks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'block-wrapper';

      const block = document.createElement('div');
      block.className = 'block';
      block.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      wrapper.appendChild(block);
      grid.appendChild(wrapper);

      // each block now tracks its own intensity, starting at 0
      blocks.push({ el: block, row: r, col: c, intensity: 0 });
    }
  }
}

buildGrid();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildGrid, 150);
});

document.addEventListener('mousemove', (e) => {
  mouseCol = e.clientX / cellSize;
  mouseRow = e.clientY / cellSize;
});

function animate() {
  for (const b of blocks) {
    const dx = (b.col + 0.5) - mouseCol;
    const dy = (b.row + 0.5) - mouseRow;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const targetIntensity = Math.max(0, 1 - dist / maxDist);

    // snap up instantly if the cursor just arrived, decay slowly if it left
    if (targetIntensity > b.intensity) {
      b.intensity = targetIntensity;
    } else {
      b.intensity = Math.max(0, b.intensity - decay);
    }

    const scale = minScale + b.intensity * (maxScale - minScale);
    b.el.style.transform = `scale(${scale})`;
  }
  requestAnimationFrame(animate);
}

animate();

/* BACKGROUND */