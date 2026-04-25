export function initCognitiveIllusion(root, state) {
  if (!root) return;

  const toggle = root.querySelector('[data-illusion-toggle]');
  const circles = root.querySelectorAll('.illusion-circle');
  const feedback = root.querySelector('[data-illusion-feedback]');

  let switched = false;
  let tries = 0;

  const syncClasses = () => {
    circles.forEach((circle) => {
      circle.classList.toggle('switched', switched);
    });
  };

  syncClasses();

  circles.forEach((circle) => {
    circle.addEventListener('click', () => {
      tries += 1;
      const guess = circle.dataset.size;
      const isCorrect = guess === 'equal';
      const score = Math.max(45, 100 - (tries - 1) * 12 + (isCorrect ? 10 : -5));
      feedback.textContent = isCorrect
        ? 'Correcto: eran iguales. Tu cerebro prioriza el contexto periférico.'
        : 'Buena intuición. En realidad, ambos círculos tienen el mismo tamaño.';

      state.setResult('illusion', {
        score,
        detail: `Intentos: ${tries} · percepción contextual ${isCorrect ? 'acertada' : 'sesgada'}`
      });
    });
  });

  toggle.addEventListener('click', () => {
    switched = !switched;
    syncClasses();
    toggle.textContent = switched ? 'Ver patrón original' : 'Cambiar contexto';
  });
}
