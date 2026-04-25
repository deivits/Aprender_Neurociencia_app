import { labState, renderPerformanceCards } from './labState.js';
import { initAttentionTest } from './attentionTest.js';
import { initCognitiveIllusion } from './cognitiveIllusion.js';
import { initMemoryMiniTest } from './memoryMiniTest.js';

function initLab() {
  const page = document.getElementById('page-laboratorio');
  if (!page) return;

  initAttentionTest(page.querySelector('[data-lab-attention]'), labState);
  initCognitiveIllusion(page.querySelector('[data-lab-illusion]'), labState);
  initMemoryMiniTest(page.querySelector('[data-lab-memory]'), labState);

  const scoreContainer = document.getElementById('lab-performance-grid');
  labState.subscribe((results) => renderPerformanceCards(scoreContainer, results));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLab, { once: true });
} else {
  initLab();
}
