/* BACKGROUND */

const grid = document.getElementById('block-grid');

const cellSize = 36;       // fixed px size — this is what makes cells perfectly square
const maxDist = Math.sqrt(2) * 2;
const minScale = 0.01;
const maxScale = 1;

const colors = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E', '#7F77DD', '#BA7517', '#639922'];

let cols, rows, blocks = [];
let mouseCol = -10, mouseRow = -10;

function buildGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  cols = Math.ceil(w / cellSize);
  rows = Math.ceil(h / cellSize);

  grid.innerHTML = ''; // clear old blocks before rebuilding
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

      blocks.push({ el: block, row: r, col: c });
    }
  }
}

buildGrid();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer); // debounce so it doesn't rebuild on every pixel of drag
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

    const t = Math.max(0, 1 - dist / maxDist);
    const scale = minScale + t * (maxScale - minScale);

    b.el.style.transform = `scale(${scale})`;
  }
  requestAnimationFrame(animate);
}

animate();

/* BACKGROUND */