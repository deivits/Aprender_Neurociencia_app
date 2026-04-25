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

let bootPromise = null;

export function bootstrapBrain3D() {
  if (bootPromise) return bootPromise;

  bootPromise = new Promise((resolve) => {
    const container = document.getElementById('brain-viewport');
    const panelEl = document.getElementById('brain-panel');
    if (!container || !panelEl) {
      resolve(null);
      return;
    }

    const panel = new BrainPanel(panelEl);
    const sceneApi = createBrainScene(container);

    let interactionsApi = null;
    let rootModel = null;
    let frameId = null;
    let modelCleanup = null;
    let isPageActive = document.getElementById('page-mapa')?.classList.contains('active') ?? false;
    let isViewportVisible = false;

    const shouldRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function shouldRender() {
      return !!rootModel && isPageActive && isViewportVisible && !document.hidden;
    }

    function renderFrame() {
      if (!shouldRender()) {
        frameId = null;
        return;
      }

      if (shouldRotate) {
        rootModel.rotation.y += 0.003;
      }

      interactionsApi?.update();
      sceneApi.renderer.render(sceneApi.scene, sceneApi.camera);
      frameId = requestAnimationFrame(renderFrame);
    }

    function ensureLoopState() {
      if (shouldRender()) {
        if (frameId == null) {
          frameId = requestAnimationFrame(renderFrame);
        }
      } else if (frameId != null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      isViewportVisible = entries.some((entry) => entry.isIntersecting);
      ensureLoopState();
    }, { threshold: 0.2 });

    visibilityObserver.observe(container);

    modelCleanup = lazyLoadBrainModel({
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
        sceneApi.onResize();
        ensureLoopState();
      }
    });

    const onRegionActive = (event) => panel.show(event.detail.region);
    const onPageChanged = (event) => {
      const pageId = event.detail?.pageId;
      isPageActive = pageId === 'brain3d' || pageId === 'mapa';
      if (isPageActive) {
        sceneApi.onResize();
      }
      ensureLoopState();
    };
    const onDocVisibility = () => ensureLoopState();

    window.addEventListener('brain:region-active', onRegionActive);
    window.addEventListener('page:changed', onPageChanged);
    document.addEventListener('visibilitychange', onDocVisibility);

    resolve({
      dispose() {
        if (frameId != null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
        visibilityObserver.disconnect();
        modelCleanup?.();
        interactionsApi?.dispose();
        sceneApi.dispose();
        window.removeEventListener('brain:region-active', onRegionActive);
        window.removeEventListener('page:changed', onPageChanged);
        document.removeEventListener('visibilitychange', onDocVisibility);
      }
    });
  });

  return bootPromise;
}

export { BrainPanel };
