const questions = [
  {
    q: '¿A qué edad madura completamente el córtex prefrontal humano?',
    opts: ['16 años', '18 años', '25 años', '30 años'],
    ans: 2,
    exp: 'El córtex prefrontal, responsable del control ejecutivo y la toma de decisiones, alcanza su madurez plena alrededor de los 25 años.'
  },
  {
    q: '¿Cuántas conexiones sinápticas puede formar una neurona durante los primeros años de vida?',
    opts: ['Hasta 1.000', 'Hasta 5.000', 'Hasta 15.000', 'Hasta 100.000'],
    ans: 2,
    exp: "En los primeros años de vida, cada neurona puede establecer hasta 15.000 conexiones sinápticas, durante la 'sinaptogénesis explosiva'."
  },
  {
    q: "¿Qué sustancia libera el ejercicio aeróbico y se llama 'fertilizante cerebral'?",
    opts: ['Serotonina', 'BDNF', 'Cortisol', 'Insulina'],
    ans: 1,
    exp: 'El BDNF (Factor Neurotrófico Derivado del Cerebro) se eleva hasta 3x con el ejercicio aeróbico y promueve la neurogénesis y la plasticidad sináptica.'
  },
  {
    q: '¿Qué ocurre durante el sueño profundo (N3) en el cerebro?',
    opts: [
      'Se generan sueños vívidos',
      'El sistema glinfático elimina proteínas tóxicas como el beta-amiloide',
      'Aumenta la actividad del córtex visual',
      'Se libera adrenalina'
    ],
    ans: 1,
    exp: 'Durante el sueño N3 (ondas delta), el sistema glinfático actúa como sistema de limpieza cerebral, eliminando productos de desecho como el beta-amiloide, asociado al Alzheimer.'
  },
  {
    q: "Según el 'Efecto de Prueba' (Testing Effect), ¿qué estrategia mejora más la memoria?",
    opts: [
      'Releer el material varias veces',
      'Subrayar con diferentes colores',
      'Recuperar activamente la información',
      'Estudiar en grupos grandes'
    ],
    ans: 2,
    exp: 'La práctica de recuperación activa (intentar recordar sin mirar el material) es 2–3 veces más efectiva que releer para consolidar memoria a largo plazo.'
  },
  {
    q: '¿Por qué los adolescentes tienden a buscar más riesgo y novedad?',
    opts: [
      'Por inmadurez emocional general',
      'Porque el sistema límbico madura antes que el córtex prefrontal',
      'Por influencia hormonal exclusivamente',
      'Porque tienen menos neuronas que los adultos'
    ],
    ans: 1,
    exp: 'El desequilibrio entre el sistema límbico (ya maduro, hipersensible a recompensas) y el córtex prefrontal (aún en desarrollo) explica la búsqueda de riesgo adolescente.'
  },
  {
    q: "¿Qué es la 'reserva cognitiva'?",
    opts: [
      'La cantidad de neuronas que uno nace',
      'La capacidad del cerebro de tolerar daño sin manifestar síntomas clínicos',
      'El volumen total del hipocampo',
      'La velocidad de procesamiento neural'
    ],
    ans: 1,
    exp: 'La reserva cognitiva es la capacidad del cerebro de usar redes alternativas para compensar daño neurológico. Se construye con educación, ejercicio y estimulación cognitiva.'
  },
  {
    q: 'El principio de Hebb establece que...',
    opts: [
      'El cerebro adulto no puede cambiar',
      'Las neuronas que se activan juntas, se conectan juntas',
      'El sueño bloquea la plasticidad',
      'La memoria disminuye con la edad inevitablemente'
    ],
    ans: 1,
    exp: "La Regla de Hebb ('neurons that fire together, wire together') es el mecanismo celular del aprendizaje: la activación repetida de una sinapsis la fortalece estructuralmente."
  }
];

let answered = [];
let score = 0;

export function renderQuiz() {
  answered = new Array(questions.length).fill(null);
  score = 0;

  const container = document.getElementById('quiz-container');
  if (!container) return;

  container.innerHTML =
    questions
      .map(
        (question, questionIndex) => `
      <div class="quiz-section" id="q${questionIndex}" style="margin-bottom:1.5rem;">
        <div class="quiz-q">${questionIndex + 1}. ${question.q}</div>
        <div class="quiz-options">
          ${question.opts
            .map(
              (opt, optionIndex) =>
                `<div class="quiz-opt" data-qi="${questionIndex}" data-opt="${optionIndex}" id="opt-${questionIndex}-${optionIndex}">${opt}</div>`
            )
            .join('')}
        </div>
        <div class="quiz-feedback" id="fb-${questionIndex}"></div>
      </div>
    `
      )
      .join('') +
    '<div id="quiz-result" style="display:none;text-align:center;padding:2rem;background:white;border-radius:16px;border:1px solid var(--border);margin-top:1rem;"></div>';
}

export function answerQ(qi, optIdx) {
  if (answered[qi] !== null) return;

  answered[qi] = optIdx;
  const correctAnswer = questions[qi].ans;

  for (let optionIndex = 0; optionIndex < questions[qi].opts.length; optionIndex += 1) {
    const optionElement = document.getElementById(`opt-${qi}-${optionIndex}`);
    if (!optionElement) continue;
    optionElement.style.pointerEvents = 'none';
    if (optionIndex === correctAnswer) optionElement.classList.add('correct');
    if (optionIndex === optIdx && optIdx !== correctAnswer) optionElement.classList.add('wrong');
  }

  const feedback = document.getElementById(`fb-${qi}`);
  if (!feedback) return;

  if (optIdx === correctAnswer) {
    score += 1;
    feedback.textContent = `✅ ${questions[qi].exp}`;
    feedback.style.color = 'var(--teal-light)';
  } else {
    feedback.textContent = `❌ ${questions[qi].exp}`;
    feedback.style.color = 'var(--coral)';
  }

  if (answered.every((entry) => entry !== null)) showResult();
}

function showResult() {
  const resultElement = document.getElementById('quiz-result');
  if (!resultElement) return;

  const pct = Math.round((score / questions.length) * 100);
  const msg =
    pct >= 80
      ? '🧠 ¡Experto en Neurociencia!'
      : pct >= 60
        ? '👍 Buen conocimiento, seguí aprendiendo'
        : '📚 Revisá los módulos para reforzar';

  resultElement.style.display = 'block';
  resultElement.innerHTML = `
      <div style="font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:900;color:var(--teal)">${pct}%</div>
      <div style="font-size:1.1rem;font-weight:600;margin:.5rem 0">${score} / ${questions.length} correctas</div>
      <div style="font-size:.9rem;color:rgba(14,14,20,.6)">${msg}</div>
    `;
}

export function resetQuiz() {
  renderQuiz();
}

export function initQuizDelegation() {
  document.addEventListener('click', (event) => {
    const option = event.target.closest('.quiz-opt[data-qi][data-opt]');
    if (!option) return;
    answerQ(Number(option.dataset.qi), Number(option.dataset.opt));
  });
}
