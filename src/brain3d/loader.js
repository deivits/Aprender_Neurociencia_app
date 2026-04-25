import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js';

function createOverlay(container, variant = 'loading') {
  const overlay = document.createElement('div');
  overlay.className = `brain-loader-overlay ${variant}`;
  container.appendChild(overlay);
  return overlay;
}

function renderLoadingState(overlay, progress = 0) {
  const value = Math.max(0, Math.min(progress, 100));
  overlay.innerHTML = `
    <div class="brain-skeleton-card">
      <div class="brain-skeleton-glow"></div>
      <div class="brain-skeleton-line"></div>
      <div class="brain-skeleton-line short"></div>
      <div class="brain-progress"><span style="width:${value}%"></span></div>
      <p>Cargando modelo cerebral premium… ${value.toFixed(0)}%</p>
    </div>
  `;
}

function renderFallbackState(overlay, errorMessage) {
  overlay.classList.remove('loading');
  overlay.classList.add('error');
  overlay.innerHTML = `
    <div class="brain-fallback-card">
      <h3>No se pudo cargar el modelo 3D</h3>
      <p>${errorMessage}</p>
      <button type="button" class="brain-fallback-btn">Reintentar carga</button>
    </div>
  `;
}

export function lazyLoadBrainModel({ scene, container, modelUrl, onLoaded, onRetry }) {
  const loader = new GLTFLoader();
  let overlay = createOverlay(container, 'loading');
  renderLoadingState(overlay, 0);

  function attachModel(gltf) {
    const root = gltf.scene;
    root.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(node.material.roughness ?? 0.8, 0.9);
          node.material.metalness = Math.max(node.material.metalness ?? 0.02, 0.02);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()).length() || 1;
    const center = box.getCenter(new THREE.Vector3());

    root.position.sub(center);
    root.scale.setScalar(2 / size);
    root.position.y = -0.2;

    scene.add(root);
    overlay.remove();
    onLoaded?.(root);
  }

  function doLoad() {
    renderLoadingState(overlay, 5);
    loader.load(
      modelUrl,
      (gltf) => attachModel(gltf),
      (event) => {
        if (event.total) {
          renderLoadingState(overlay, (event.loaded / event.total) * 100);
        }
      },
      (error) => {
        const message = 'Verifica tu conexión o la ruta del archivo GLTF/GLB.';
        console.error('[brain3d] Error cargando modelo:', error);
        renderFallbackState(overlay, message);

        const retryBtn = overlay.querySelector('.brain-fallback-btn');
        retryBtn?.addEventListener('click', () => {
          overlay.remove();
          overlay = createOverlay(container, 'loading');
          renderLoadingState(overlay, 0);
          onRetry?.();
          doLoad();
        });
      }
    );
  }

  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    doLoad();
  }, { threshold: 0.2 });

  observer.observe(container);

  return () => {
    observer.disconnect();
    overlay?.remove();
  };
}
