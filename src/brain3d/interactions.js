import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';
import { resolveRegionByMeshName } from './regionsData.js';

export function setupInteractions({ THREE, scene, camera, renderer, rootObject, emitTarget = window }) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.8;
  controls.maxDistance = 6;
  controls.target.set(0, 0.1, 0);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredMesh = null;
  let selectedMesh = null;

  const interactiveMeshes = [];
  rootObject?.traverse((node) => {
    if (node.isMesh) {
      interactiveMeshes.push(node);
      node.userData.originalEmissive = node.material?.emissive?.clone?.() || null;
      node.userData.originalEmissiveIntensity = node.material?.emissiveIntensity ?? 0;
    }
  });

  function setMeshHighlight(mesh, active) {
    if (!mesh?.material?.emissive) return;
    if (active) {
      mesh.material.emissive.set('#4fa8ff');
      mesh.material.emissiveIntensity = 0.45;
    } else {
      const original = mesh.userData.originalEmissive;
      if (original) mesh.material.emissive.copy(original);
      mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity ?? 0;
    }
  }

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickMesh(event) {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes, true);
    return hits[0]?.object || null;
  }

  function onPointerMove(event) {
    const mesh = pickMesh(event);
    if (mesh === hoveredMesh) return;

    if (hoveredMesh && hoveredMesh !== selectedMesh) {
      setMeshHighlight(hoveredMesh, false);
    }

    hoveredMesh = mesh;
    if (hoveredMesh && hoveredMesh !== selectedMesh) {
      setMeshHighlight(hoveredMesh, true);
    }
  }

  function onClick(event) {
    const mesh = pickMesh(event);
    if (!mesh) return;

    if (selectedMesh && selectedMesh !== mesh) {
      setMeshHighlight(selectedMesh, false);
    }

    selectedMesh = mesh;
    setMeshHighlight(selectedMesh, true);

    const region = resolveRegionByMeshName(mesh.name) || {
      name: mesh.name || 'Región no identificada',
      function: 'Esta malla no está mapeada todavía en regionsData.js.',
      practicalExample: 'Puedes ampliar el mapeo añadiendo su nombre en meshNames.'
    };

    emitTarget.dispatchEvent(new CustomEvent('brain:region-active', {
      detail: {
        mesh,
        region
      }
    }));
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('click', onClick);

  return {
    controls,
    update() {
      controls.update();
    },
    dispose() {
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
    }
  };
}
