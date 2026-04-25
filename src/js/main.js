import { initAccordionDelegation, toggleAcc } from './accordion.js';
import { navigate as navigateToPage, initNavigationDelegation, toggleSidebar } from './navigation.js';
import { answerQ, initQuizDelegation, renderQuiz, resetQuiz } from './quiz.js';
import { initTabsDelegation, showTab } from './tabs.js';

function navigate(pageId, navEl) {
  navigateToPage(pageId, navEl);
  if (pageId === 'quiz') renderQuiz();
}

function bootstrap() {
  initNavigationDelegation();
  initTabsDelegation();
  initAccordionDelegation();
  initQuizDelegation();
  renderQuiz();

  // API pública equivalente durante la transición desde handlers inline.
  window.toggleSidebar = toggleSidebar;
  window.navigate = navigate;
  window.showTab = showTab;
  window.toggleAcc = toggleAcc;
  window.answerQ = answerQ;
  window.resetQuiz = resetQuiz;
}

bootstrap();
