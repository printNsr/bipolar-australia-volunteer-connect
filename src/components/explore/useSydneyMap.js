import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createSydneyScene from "./createSydneyScene";
import { addMapLabels, refreshMapLabels } from "./sydneyMapLabels";

export default function useSydneyMap(containerRef, selectedId, onSelect, countFor) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const host = containerRef.current;
    const scene = createSydneyScene();
    sceneRef.current = scene;
    addMapLabels(scene, countFor, selectedId);
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, .1, 100);
    camera.position.set(17, 17, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enableDamping: true, dampingFactor: .06, minDistance: 13, maxDistance: 38, maxPolarAngle: Math.PI * .49, autoRotate: true, autoRotateSpeed: .35 });
    controls.target.set(0, 1, 0);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let start = null;
    const down = (event) => { start = [event.clientX, event.clientY]; controls.autoRotate = false; };
    const up = (event) => {
      if (!start || Math.hypot(event.clientX - start[0], event.clientY - start[1]) > 5) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(scene.children, true).find(({ object }) => object.userData.landmarkId);
      if (hit) onSelect(hit.object.userData.landmarkId);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);

    const resize = () => { camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    let frame;
    const render = () => { controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(render); };
    render();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); renderer.dispose();
      renderer.domElement.removeEventListener("pointerdown", down); renderer.domElement.removeEventListener("pointerup", up);
      scene.traverse((item) => { item.geometry?.dispose(); item.material?.map?.dispose?.(); item.material?.dispose?.(); });
      host.replaceChildren(); sceneRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    if (sceneRef.current) refreshMapLabels(sceneRef.current, countFor, selectedId);
  }, [selectedId, countFor]);
}