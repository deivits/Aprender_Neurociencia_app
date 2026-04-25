import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

function getSafePixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  if (window.matchMedia('(max-width: 768px)').matches) {
    return Math.min(dpr, 1.6);
  }
  return Math.min(dpr, 2);
}

export function createBrainScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0f1118');

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.2, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(getSafePixelRatio());
  renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1));

  container.appendChild(renderer.domElement);

  // Premium soft lights: ambient + key + rim
  const ambient = new THREE.AmbientLight('#d8e3ff', 0.7);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#fff2d0', 1.25);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#7ec7ff', 0.95);
  rimLight.position.set(-5, 2, -6);
  scene.add(rimLight);

  const fillLight = new THREE.HemisphereLight('#95a8ff', '#0f121f', 0.45);
  scene.add(fillLight);

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
