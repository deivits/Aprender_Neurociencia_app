import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

function getSafePixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  if (window.matchMedia('(max-width: 768px)').matches) {
    return Math.min(dpr, 1.25);
  }
  return Math.min(dpr, 1.8);
}

export function createBrainScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0f1118');

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.15, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(getSafePixelRatio());
  renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1));

  container.appendChild(renderer.domElement);

  const ambient = new THREE.HemisphereLight('#9eb5ff', '#0f121f', 0.78);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#fff0cc', 1.12);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  function onResize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(getSafePixelRatio());
    renderer.setSize(width, height, false);
  }

  window.addEventListener('resize', onResize);

  return {
    THREE,
    scene,
    camera,
    renderer,
    onResize,
    dispose() {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    }
  };
}
