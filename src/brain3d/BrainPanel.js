import { createBrainScene } from './scene.js';
import { lazyLoadBrainModel } from './loader.js';
import { setupInteractions } from './interactions.js';

class BrainPanel {
  constructor(panelEl) {
    this.panelEl = panelEl;
    this.closeBtn = panelEl.querySelector('[data-panel-close]');
    this.title = panelEl.querySelector('[data-region-name]');
    this.func = panelEl.querySelector('[data-region-function]');
    this.example = panelEl.querySelector('[data-region-example]');

    this.closeBtn?.addEventListener('click', () => this.hide());
  }

  show(region) {
    this.title.textContent = region.name;
    this.func.textContent = region.function;
    this.example.textContent = region.practicalExample;
    this.panelEl.classList.add('is-visible');
  }

  hide() {
    this.panelEl.classList.remove('is-visible');
  }
}

function bootstrapBrain3D() {
  const container = document.getElementById('brain-viewport');
  const panelEl = document.getElementById('brain-panel');
  if (!container || !panelEl) return;

  const panel = new BrainPanel(panelEl);
  const sceneApi = createBrainScene(container);

  let interactionsApi = null;
  let rootModel = null;

  lazyLoadBrainModel({
    scene: sceneApi.scene,
    container,
    modelUrl: './src/brain3d/assets/brain.glb',
    onLoaded: (root) => {
      rootModel = root;
      interactionsApi = setupInteractions({
        THREE: sceneApi.THREE,
        scene: sceneApi.scene,
        camera: sceneApi.camera,
        renderer: sceneApi.renderer,
        rootObject: rootModel,
        emitTarget: window
      });
    }
  });

  window.addEventListener('brain:region-active', (event) => {
    panel.show(event.detail.region);
  });

  window.addEventListener('page:changed', (event) => {
    if (event.detail?.pageId === 'brain3d' || event.detail?.pageId === 'mapa') {
      sceneApi.onResize();
    }
  });

  const clock = new sceneApi.THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (rootModel) {
      rootModel.rotation.y += clock.getDelta() * 0.2;
    }
    interactionsApi?.update();
    sceneApi.renderer.render(sceneApi.scene, sceneApi.camera);
  }

  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapBrain3D);
} else {
  bootstrapBrain3D();
}

export { BrainPanel, bootstrapBrain3D };
