const experimentsMeta = {
  attention: {
    name: 'Atención Reactiva',
    goodThreshold: 75,
    icon: '⚡'
  },
  illusion: {
    name: 'Ilusión Cognitiva',
    goodThreshold: 70,
    icon: '🌀'
  },
  memory: {
    name: 'Memoria de Trabajo',
    goodThreshold: 65,
    icon: '🧩'
  }
};

class LabState {
  constructor() {
    this.results = {};
    this.listeners = new Set();
  }

  setResult(experimentId, payload) {
    const meta = experimentsMeta[experimentId];
    if (!meta) return;
    const score = Number(payload.score ?? 0);
    const result = {
      ...payload,
      score,
      label: this.getLabel(score, meta.goodThreshold),
      semantic: this.getSemantic(score, meta.goodThreshold),
      updatedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      name: meta.name,
      icon: meta.icon
    };
    this.results[experimentId] = result;
    this.notify();
  }

  getLabel(score, threshold) {
    if (score >= threshold + 20) return 'Excelente';
    if (score >= threshold) return 'Sólido';
    if (score >= threshold - 15) return 'En progreso';
    return 'A reforzar';
  }

  getSemantic(score, threshold) {
    if (score >= threshold + 20) return 'success';
    if (score >= threshold) return 'positive';
    if (score >= threshold - 15) return 'warning';
    return 'critical';
  }

  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.results);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.results));
  }
}

export const labState = new LabState();

export function renderPerformanceCards(container, results) {
  if (!container) return;
  const cards = Object.entries(experimentsMeta).map(([id, meta]) => {
    const result = results[id];
    if (!result) {
      return `
        <article class="lab-score-card">
          <header><span>${meta.icon}</span><h4>${meta.name}</h4></header>
          <p class="lab-score-empty">Aún sin resultados.</p>
        </article>`;
    }

    return `
      <article class="lab-score-card semantic-${result.semantic}">
        <header><span>${meta.icon}</span><h4>${result.name}</h4></header>
        <div class="lab-score-value">${Math.round(result.score)}%</div>
        <p class="lab-score-label">${result.label}</p>
        <p class="lab-score-detail">${result.detail || 'Resultado actualizado.'}</p>
        <small>Último intento: ${result.updatedAt}</small>
      </article>`;
  });

  container.innerHTML = cards.join('');
}
