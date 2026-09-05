import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createSydneyScene from "./createSydneyScene";

export default function useSydneyMap(containerRef, selectedId) {
  useEffect(() => {
    const host = containerRef.current;
    const scene = createSydneyScene();
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
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = .06;
    controls.minDistance = 13;
    controls.maxDistance = 38;
    controls.maxPolarAngle = Math.PI * .49;
    controls.autoRotate = true;
    controls.autoRotateSpeed = .35;

    const resize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    let frame;
    const render = () => { controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(render); };
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((item) => { item.geometry?.dispose(); item.material?.dispose?.(); });
      host.replaceChildren();
    };
  }, [containerRef]);

  useEffect(() => {
    const host = containerRef.current;
    if (host) host.dataset.selectedLandmark = selectedId || "";
  }, [containerRef, selectedId]);
}