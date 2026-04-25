export function toggleAcc(header) {
  const item = header?.closest('.acc-item');
  item?.classList.toggle('open');
}

export function initAccordionDelegation() {
  document.addEventListener('click', (event) => {
    const header = event.target.closest('.acc-header');
    if (!header) return;
    toggleAcc(header);
  });
}
