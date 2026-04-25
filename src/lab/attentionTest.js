export function initAttentionTest(root, state) {
  if (!root) return;

  const btn = root.querySelector('[data-attention-start]');
  const arena = root.querySelector('[data-attention-arena]');
  const status = root.querySelector('[data-attention-status]');

  let attempts = 0;
  let hits = 0;
  let timerId = null;
  let roundTimeout = null;

  function clearTimers() {
    clearTimeout(timerId);
    clearTimeout(roundTimeout);
  }

  function finish() {
    clearTimers();
    const accuracy = attempts ? (hits / attempts) * 100 : 0;
    const speedBonus = Math.max(0, 100 - attempts * 3);
    const score = Math.round(accuracy * 0.75 + speedBonus * 0.25);
    status.textContent = `Finalizado: ${hits}/${attempts} aciertos.`;
    state.setResult('attention', {
      score,
      detail: `Aciertos ${hits}/${attempts} · Precisión ${Math.round(accuracy)}%`
    });
    btn.textContent = 'Reintentar';
    arena.classList.remove('is-live');
  }

  function round(step) {
    if (step > 8) {
      finish();
      return;
    }
    status.textContent = `Ronda ${step}/8: toca el estímulo dorado.`;
    arena.innerHTML = '';

    const target = document.createElement('button');
    target.type = 'button';
    target.className = 'attention-dot target';
    target.ariaLabel = 'Estímulo objetivo';

    const decoy = document.createElement('button');
    decoy.type = 'button';
    decoy.className = 'attention-dot decoy';
    decoy.ariaLabel = 'Distractor visual';

    const targetTop = 10 + Math.random() * 70;
    const targetLeft = 8 + Math.random() * 80;
    const decoyTop = 10 + Math.random() * 70;
    const decoyLeft = 8 + Math.random() * 80;

    target.style.top = `${targetTop}%`;
    target.style.left = `${targetLeft}%`;
    decoy.style.top = `${decoyTop}%`;
    decoy.style.left = `${decoyLeft}%`;

    const onTap = (isTarget) => {
      attempts += 1;
      if (isTarget) hits += 1;
      round(step + 1);
    };

    target.addEventListener('click', () => onTap(true), { once: true });
    decoy.addEventListener('click', () => onTap(false), { once: true });

    arena.append(target, decoy);

    roundTimeout = setTimeout(() => {
      attempts += 1;
      round(step + 1);
    }, 1500);
  }

  btn.addEventListener('click', () => {
    clearTimers();
    attempts = 0;
    hits = 0;
    arena.classList.add('is-live');
    btn.textContent = 'En curso…';
    status.textContent = 'Preparado…';
    timerId = setTimeout(() => round(1), 700);
  });
}
