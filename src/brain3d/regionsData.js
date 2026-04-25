export const regionsData = [
  {
    id: 'frontal',
    name: 'Lóbulo frontal',
    function: 'Coordina funciones ejecutivas: planificación, control inhibitorio, toma de decisiones y regulación de conducta.',
    practicalExample: 'Cuando organizas tu día y priorizas tareas importantes antes de distraerte con el teléfono.',
    meshNames: ['Frontal_Lobe', 'FrontalLobe', 'frontal_lobe', 'frontal']
  },
  {
    id: 'temporal',
    name: 'Lóbulo temporal',
    function: 'Participa en el procesamiento auditivo, comprensión del lenguaje y memoria semántica.',
    practicalExample: 'Cuando entiendes una conversación y recuerdas el significado de palabras nuevas.',
    meshNames: ['Temporal_Lobe', 'TemporalLobe', 'temporal_lobe', 'temporal']
  },
  {
    id: 'parietal',
    name: 'Lóbulo parietal',
    function: 'Integra información sensorial y espacial para orientar el cuerpo en el entorno.',
    practicalExample: 'Cuando alcanzas una taza sin mirarla directamente porque ubicas su posición en el espacio.',
    meshNames: ['Parietal_Lobe', 'ParietalLobe', 'parietal_lobe', 'parietal']
  },
  {
    id: 'occipital',
    name: 'Lóbulo occipital',
    function: 'Especializado en procesamiento visual: forma, color, movimiento y reconocimiento básico de patrones.',
    practicalExample: 'Cuando identificas rápidamente una señal de tránsito al conducir.',
    meshNames: ['Occipital_Lobe', 'OccipitalLobe', 'occipital_lobe', 'occipital']
  },
  {
    id: 'cerebelo',
    name: 'Cerebelo',
    function: 'Afina coordinación motora, equilibrio y contribuye a automatización de habilidades cognitivas y motoras.',
    practicalExample: 'Cuando mantienes estabilidad en bicicleta mientras hablas al mismo tiempo.',
    meshNames: ['Cerebellum', 'cerebellum', 'cerebelo']
  },
  {
    id: 'amigdala',
    name: 'Amígdala',
    function: 'Detecta relevancia emocional (especialmente amenaza) y modula memorias con carga afectiva.',
    practicalExample: 'Cuando recuerdas con nitidez una situación que te dio mucho miedo o alegría.',
    meshNames: ['Amygdala', 'amygdala', 'amigdala']
  },
  {
    id: 'hipocampo',
    name: 'Hipocampo',
    function: 'Clave para consolidar memoria episódica y navegación espacial.',
    practicalExample: 'Cuando aprendes una ruta nueva y luego puedes repetirla sin mapa.',
    meshNames: ['Hippocampus', 'hippocampus', 'hipocampo']
  }
];

export const regionLookup = regionsData.reduce((acc, region) => {
  region.meshNames.forEach((meshName) => {
    acc[meshName.toLowerCase()] = region;
  });
  return acc;
}, {});

export function resolveRegionByMeshName(meshName = '') {
  return regionLookup[meshName.toLowerCase()] || null;
}
