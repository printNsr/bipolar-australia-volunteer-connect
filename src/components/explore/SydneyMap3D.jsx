import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LANDMARKS } from "./landmarks";

const COLORS = {
  opera_house: 0xfdfdfb,
  harbour_bridge: 0x9aa5ab,
  sydney_tower: 0xf3d98a,
  qvb: 0xe8b98a,
  luna_park: 0xe79aa2,
  bondi: 0x8fd0d6,
  circular_quay: 0x7fc3a1
};

const toWorld = (l) => ({ x: (l.x - 50) * 0.9, z: (l.y - 45) * 0.9 });

export default function SydneyMap3D({ selectedId, onSelect, countFor }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [labels, setLabels] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.set(90, 80, 90);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8e6d0, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(60, 90, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    scene.add(sun);

    // land
    const land = new THREE.Mesh(
      new THREE.BoxGeometry(120, 4, 100),
      new THREE.MeshLambertMaterial({ color: 0xdfe9d4 })
    );
    land.position.y = -2;
    land.receiveShadow = true;
    scene.add(land);

    // harbour water
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(120, 4.6, 30),
      new THREE.MeshLambertMaterial({ color: 0x7ec4e8 })
    );
    water.position.set(0, -1.9, -35);
    scene.add(water);

    // street grid
    const grid = new THREE.GridHelper(120, 24, 0xffffff, 0xffffff);
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    grid.position.y = 0.05;
    scene.add(grid);

    // buildings
    const buildings = [];
    LANDMARKS.forEach((l) => {
      const { x, z } = toWorld(l);
      const h = l.height * 0.28;
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(7, h, 7),
        new THREE.MeshLambertMaterial({ color: COLORS[l.id] || 0xcccccc })
      );
      body.position.set(x, h / 2, z);
      body.castShadow = true;
      body.receiveShadow = true;
      body.userData = { id: l.id, baseY: h / 2, height: h };
      scene.add(body);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(8.2, 1.2, 8.2),
        new THREE.MeshLambertMaterial({ color: 0x0a7a3a })
      );
      roof.position.set(x, h + 0.6, z);
      roof.castShadow = true;
      roof.userData = { id: l.id, baseY: h + 0.6 };
      scene.add(roof);

      buildings.push(body, roof);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const project = () => {
      const { clientWidth: w, clientHeight: hgt } = mount;
      const next = LANDMARKS.map((l) => {
        const { x, z } = toWorld(l);
        const v = new THREE.Vector3(x, l.height * 0.28 + 6, z).project(camera);
        return { id: l.id, name: l.name, left: (v.x * 0.5 + 0.5) * w, top: (-v.y * 0.5 + 0.5) * hgt };
      });
      setLabels(next);
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const aspect = w / h;
      const frustum = 78;
      camera.left = -frustum * aspect / 2;
      camera.right = frustum * aspect / 2;
      camera.top = frustum / 2;
      camera.bottom = -frustum / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
      project();
    };

    stateRef.current = { scene, camera, renderer, buildings, raycaster, pointer, mount, render: () => renderer.render(scene, camera) };
    resize();

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(buildings)[0];
      setHovered(hit ? hit.object.userData.id : null);
      mount.style.cursor = hit ? "pointer" : "default";
    };

    const onClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(buildings)[0];
      if (hit) onSelect(hit.object.userData.id);
    };

    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    return () => {
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // lift the selected / hovered landmark
  useEffect(() => {
    const s = stateRef.current;
    if (!s.buildings) return;
    s.buildings.forEach((m) => {
      const lift = m.userData.id === selectedId ? 4 : m.userData.id === hovered ? 1.5 : 0;
      m.position.y = m.userData.baseY + lift;
    });
    s.render();
  }, [selectedId, hovered]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-background to-muted">
      <div ref={mountRef} className="h-[340px] w-full sm:h-[440px]" />
      {labels.map((l) => {
        const active = l.id === selectedId;
        return (
          <button
            key={l.id}
            onClick={() => onSelect(l.id)}
            onMouseEnter={() => setHovered(l.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ left: l.left, top: l.top }}
            className={`absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium shadow-md transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "bg-card/95 text-foreground hover:bg-muted"
            }`}
          >
            {l.name} · {countFor(l.id)}
          </button>
        );
      })}
      <p className="pb-5 text-center text-xs text-muted-foreground">
        Click a landmark or its label to see what people have created there
      </p>
    </div>
  );
}