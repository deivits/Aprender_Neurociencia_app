const breadcrumbs = {
  home: 'Inicio',
  desarrollo: 'Desarrollo Cerebral',
  ninez: 'Niñez',
  adolescencia: 'Adolescencia',
  adultez: 'Adultez',
  memoria: 'Memoria',
  atencion: 'Atención',
  emocion: 'Emoción',
  sueno: 'Sueño',
  neuroplasticidad: 'Neuroplasticidad',
  nutricion: 'Nutrición',
  ejercicio: 'Ejercicio',
  mapa: 'Mapa Cerebral 3D',
  brain3d: 'Mapa Cerebral 3D',
  quiz: 'Quiz'
};

export function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('overlay')?.classList.toggle('show');
}

function findNavItemByPage(pageId) {
  return Array.from(document.querySelectorAll('.nav-item')).find((item) => {
    const handler = item.getAttribute('onclick') || '';
    return handler.includes(`'${pageId}'`);
  });
}

export function navigate(pageId, navEl = null) {
  const normalizedPageId = pageId === 'brain3d' ? 'mapa' : pageId;

  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
  const targetPage =
    document.getElementById(`page-${normalizedPageId}`) || document.getElementById('page-home');
  targetPage?.classList.add('active');

  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
  (navEl || findNavItemByPage(normalizedPageId))?.classList.add('active');

  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) breadcrumb.textContent = breadcrumbs[normalizedPageId] || normalizedPageId;

  if (window.innerWidth < 900) {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('show');
  }

  window.scrollTo(0, 0);
  window.dispatchEvent(new CustomEvent('page:changed', { detail: { pageId: normalizedPageId } }));
}

export function initNavigationDelegation() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-nav-page]');
    if (!trigger) return;
    const pageId = trigger.dataset.navPage;
    if (!pageId) return;
    navigate(pageId, trigger.closest('.nav-item'));
  });
}
