import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LANDMARKS } from "./landmarks";
import { buildTerrain } from "./three/terrain";
import { BUILDERS } from "./three/landmarkModels";

export default function SydneyMap({ selectedId, onSelect, countFor }) {
  const mountRef = useRef(null);
  const labelsRef = useRef({});
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#cfe6ef");
    scene.fog = new THREE.Fog("#cfe6ef", 260, 460);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    let zoom = 1;
    const setSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      const frustum = 185 * zoom;
      const aspect = w / h;
      camera.left = (-frustum * aspect) / 2;
      camera.right = (frustum * aspect) / 2;
      camera.top = frustum / 2;
      camera.bottom = -frustum / 2;
      camera.updateProjectionMatrix();
    };

    const sun = new THREE.DirectionalLight("#fff6e2", 1.25);
    sun.position.set(90, 140, 70);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const d = 160;
    Object.assign(sun.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 1, far: 500 });
    scene.add(sun);
    scene.add(new THREE.HemisphereLight("#eaf6fb", "#e0d6bd", 1.25));

    const world = new THREE.Group();
    scene.add(world);
    world.add(buildTerrain());

    const pickable = [];
    const anchors = {};
    LANDMARKS.forEach((l) => {
      const model = BUILDERS[l.id]();
      model.position.set(l.x, 2.5, l.z);
      model.scale.setScalar(1.25);
      model.traverse((o) => { o.userData.landmarkId = l.id; });
      model.userData.landmarkId = l.id;
      world.add(model);
      pickable.push(model);
      anchors[l.id] = new THREE.Vector3(l.x, l.labelY, l.z);
      if (model.userData.wheel) model.userData.spin = model.userData.wheel;
    });

    // camera orbit
    let azimuth = -Math.PI / 4;
    const polar = 0.95;
    const placeCamera = () => {
      const r = 260;
      camera.position.set(
        Math.sin(azimuth) * Math.cos(polar) * r,
        Math.sin(polar) * r,
        Math.cos(azimuth) * Math.cos(polar) * r
      );
      camera.position.add(new THREE.Vector3(0, 0, 10));
      camera.lookAt(0, 0, 10);
    };
    placeCamera();
    setSize();

    // interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let lastX = 0;

    const toPointer = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const pick = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickable, true)[0];
      return hit?.object?.userData?.landmarkId;
    };
    const onDown = (e) => { dragging = true; moved = false; lastX = e.clientX; };
    const onMove = (e) => {
      if (dragging) {
        if (Math.abs(e.clientX - lastX) > 3) moved = true;
        azimuth -= (e.clientX - lastX) * 0.006;
        lastX = e.clientX;
        placeCamera();
        return;
      }
      toPointer(e);
      renderer.domElement.style.cursor = pick() ? "pointer" : "grab";
    };
    const onUp = (e) => {
      dragging = false;
      if (moved) return;
      toPointer(e);
      const id = pick();
      if (id) selectRef.current(id);
    };
    const onWheel = (e) => {
      e.preventDefault();
      zoom = Math.min(1.6, Math.max(0.5, zoom + e.deltaY * 0.001));
      setSize();
    };
    const el = renderer.domElement;
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", () => { dragging = false; });
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", setSize);

    // render loop
    let raf;
    const v = new THREE.Vector3();
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      pickable.forEach((m) => { if (m.userData.spin) m.userData.spin.rotation.z = t * 0.25; });

      renderer.render(scene, camera);

      const w = mount.clientWidth;
      const h = mount.clientHeight;
      Object.entries(labelsRef.current).forEach(([id, node]) => {
        if (!node || !anchors[id]) return;
        v.copy(anchors[id]).project(camera);
        node.style.transform = `translate(-50%,-100%) translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`;
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
      renderer.dispose();
      mount.removeChild(el);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div ref={mountRef} className="h-[420px] w-full sm:h-[560px]" />
      <div className="pointer-events-none absolute inset-0">
        {LANDMARKS.map((l) => {
          const active = selectedId === l.id;
          return (
            <button
              key={l.id}
              ref={(n) => { labelsRef.current[l.id] = n; }}
              onClick={() => onSelect(l.id)}
              className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md transition ${
                active ? "bg-teal-900 text-white" : "bg-white/95 text-slate-700 hover:bg-teal-50"
              }`}
            >
              {l.name} · {countFor(l.id)}
            </button>
          );
        })}
      </div>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-600">
        Drag to rotate · scroll to zoom · tap a landmark
      </p>
    </div>
  );
}