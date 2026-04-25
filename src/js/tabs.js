export function showTab(group, id, sourceButton = null) {
  document.querySelectorAll(`[id^="tab-${group}-"]`).forEach((tab) => tab.classList.remove('active'));
  document.getElementById(`tab-${group}-${id}`)?.classList.add('active');

  const activeButton =
    sourceButton ||
    (typeof event !== 'undefined' && event?.target?.closest('.tab-btn')
      ? event.target.closest('.tab-btn')
      : null);
  const buttons = activeButton?.closest('.tab-buttons')?.querySelectorAll('.tab-btn') || [];
  buttons.forEach((button) => button.classList.remove('active'));
  activeButton?.classList.add('active');
}

export function initTabsDelegation() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.tab-btn[data-tab-group][data-tab-id]');
    if (!button) return;
    showTab(button.dataset.tabGroup, button.dataset.tabId, button);
  });
}
