const STORAGE_KEY = 'neuromente_progress_v1';

export const TRACKABLE_MODULES = [
  'desarrollo',
  'ninez',
  'adolescencia',
  'adultez',
  'memoria',
  'atencion',
  'emocion',
  'sueno',
  'neuroplasticidad',
  'nutricion',
  'ejercicio',
  'mapa',
  'laboratorio'
];

const baseState = () => ({
  completed: Object.fromEntries(TRACKABLE_MODULES.map((moduleId) => [moduleId, false])),
  updatedAt: null
});

function normalizeState(state) {
  const normalized = baseState();
  if (state && typeof state === 'object' && state.completed && typeof state.completed === 'object') {
    TRACKABLE_MODULES.forEach((moduleId) => {
      normalized.completed[moduleId] = Boolean(state.completed[moduleId]);
    });
  }
  normalized.updatedAt = state?.updatedAt || null;
  return normalized;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return baseState();
  }
}

export function saveProgress(nextState) {
  const stateToPersist = normalizeState(nextState);
  stateToPersist.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  return stateToPersist;
}

export function markModuleCompleted(moduleId) {
  if (!TRACKABLE_MODULES.includes(moduleId)) {
    return loadProgress();
  }

  const current = loadProgress();
  if (current.completed[moduleId]) return current;

  return saveProgress({
    ...current,
    completed: {
      ...current.completed,
      [moduleId]: true
    }
  });
}

export function getCompletionPercent() {
  const progress = loadProgress();
  const total = TRACKABLE_MODULES.length;
  const completedCount = TRACKABLE_MODULES.filter((moduleId) => Boolean(progress.completed[moduleId])).length;
  return Math.round((completedCount / total) * 100);
}
