export function initMemoryMiniTest(root, state) {
  if (!root) return;

  const startBtn = root.querySelector('[data-memory-start]');
  const board = root.querySelector('[data-memory-board]');
  const status = root.querySelector('[data-memory-status]');

  let sequence = [];
  let userStep = 0;
  let locked = true;

  const tiles = Array.from(board.querySelectorAll('.memory-tile'));

  const flashTile = (index) => {
    const tile = tiles[index];
    tile.classList.add('flash');
    setTimeout(() => tile.classList.remove('flash'), 350);
  };

  const playSequence = () => {
    locked = true;
    status.textContent = `Memoriza ${sequence.length} estímulos.`;
    sequence.forEach((value, idx) => {
      setTimeout(() => flashTile(value), 480 * (idx + 1));
    });
    setTimeout(() => {
      locked = false;
      userStep = 0;
      status.textContent = 'Ahora repite la secuencia.';
    }, 480 * (sequence.length + 1));
  };

  const endGame = (success) => {
    locked = true;
    const base = success ? 70 : 45;
    const score = Math.min(100, base + sequence.length * 6);
    status.textContent = success ? 'Excelente memoria de trabajo.' : 'Secuencia interrumpida. Reintenta.';

    state.setResult('memory', {
      score,
      detail: `Longitud alcanzada: ${sequence.length} · ${success ? 'completada' : 'fallida'}`
    });
    startBtn.textContent = 'Reintentar';
  };

  const nextRound = () => {
    if (sequence.length >= 6) {
      endGame(true);
      return;
    }
    sequence.push(Math.floor(Math.random() * tiles.length));
    playSequence();
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      if (locked) return;
      flashTile(index);
      if (sequence[userStep] !== index) {
        endGame(false);
        return;
      }
      userStep += 1;
      if (userStep === sequence.length) {
        locked = true;
        status.textContent = '¡Correcto! siguiente nivel…';
        setTimeout(nextRound, 550);
      }
    });
  });

  startBtn.addEventListener('click', () => {
    sequence = [];
    userStep = 0;
    startBtn.textContent = 'En curso…';
    nextRound();
  });
}
