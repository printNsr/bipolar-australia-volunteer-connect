import * as THREE from "three";
import { MAT, box, cyl, cone } from "./materials";

const CITY = [
  [-100, -30], [-72, -33], [-52, -30], [-40, -40], [-30, -42], [-22, -33],
  [-8, -28], [4, -31], [14, -40], [26, -46], [34, -40], [40, -28],
  [56, -22], [72, -28], [100, -22], [100, 100], [-100, 100]
];

const NORTH = [
  [-100, -100], [100, -100], [100, -62], [60, -60], [30, -68], [-6, -62],
  [-24, -66], [-52, -60], [-100, -70]
];

function landMesh(points) {
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 2.5, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, MAT.land);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  mesh.receiveShadow = true;
  return mesh;
}

function road(w, d, x, z, rot = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), MAT.road);
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = rot;
  m.position.set(x, 2.55, z);
  m.receiveShadow = false;
  return m;
}

function tree(x, z, s = 1) {
  const g = new THREE.Group();
  g.add(cyl(0.35 * s, 0.5 * s, 2 * s, MAT.trunk, 0, 0, 0, 6));
  g.add(cone(1.7 * s, 4.5 * s, Math.random() > 0.5 ? MAT.leaf : MAT.leafDark, 0, 1.6 * s, 0, 8));
  g.position.set(x, 2.5, z);
  return g;
}

function patch(w, d, x, z, mat) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 2.58, z);
  return m;
}

export function buildTerrain() {
  const g = new THREE.Group();

  const water = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), MAT.water);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 1.4;
  water.receiveShadow = true;
  g.add(water);

  g.add(landMesh(CITY));
  g.add(landMesh(NORTH));

  // parks & sand
  g.add(patch(58, 52, 52, 4, MAT.park));       // Royal Botanic Garden
  g.add(patch(26, 22, -62, -6, MAT.park));     // Barangaroo Reserve
  g.add(patch(30, 26, 20, 62, MAT.park));      // Hyde Park
  g.add(patch(26, 12, 74, 74, MAT.sand));      // Bondi beach

  // street grid
  for (let i = -5; i <= 6; i++) g.add(road(2.2, 130, -14 + i * 12, 34));
  for (let i = -2; i <= 8; i++) g.add(road(150, 2.2, -18, -12 + i * 12));
  // north shore roads
  g.add(road(180, 2.4, 0, -80));
  g.add(road(2.4, 40, -30, -82));

  // trees
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 90; i++) g.add(tree(rnd(26, 78), rnd(-18, 28), rnd(0.7, 1.2)));
  for (let i = 0; i < 26; i++) g.add(tree(rnd(-74, -50), rnd(-16, 4), rnd(0.7, 1.1)));
  for (let i = 0; i < 30; i++) g.add(tree(rnd(6, 34), rnd(50, 74), rnd(0.7, 1.1)));
  for (let i = 0; i < 22; i++) g.add(tree(rnd(-95, 95), rnd(-95, -70), rnd(0.7, 1.1)));

  // generic city blocks
  const blocks = [];
  for (let cx = -80; cx <= 90; cx += 12) {
    for (let cz = -18; cz <= 88; cz += 12) {
      if (cx > 22 && cz < 30) continue;      // botanic garden
      if (cx > 4 && cx < 36 && cz > 48 && cz < 78) continue; // hyde park
      if (cx > 60 && cz > 60) continue;      // bondi
      if (Math.random() < 0.22) continue;
      blocks.push([cx + Math.random() * 3, cz + Math.random() * 3]);
    }
  }
  const mats = [MAT.sandstone, MAT.stone, MAT.brick, MAT.glass];
  blocks.forEach(([x, z]) => {
    const near = Math.abs(x) < 34 && z < 34;
    const h = near ? 5 + Math.random() * 15 : 4 + Math.random() * 7;
    const w = 5 + Math.random() * 3;
    const b = box(w, h, w, mats[Math.floor(Math.random() * mats.length)], x, 2.5, z);
    g.add(b);
    if (h > 18) g.add(box(w * 0.5, 2, w * 0.5, MAT.slate, x, 2.5 + h, z));
  });

  // wharves along the quay
  for (let i = 0; i < 5; i++) g.add(box(3, 1.4, 14, MAT.stone, -20 + i * 5, 1.6, -34));

  // sailboats
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Group();
    s.add(box(1.6, 0.9, 4, MAT.white, 0, 0, 0));
    const sail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 5, 4), MAT.white);
    sail.position.y = 3.4;
    s.add(sail);
    s.position.set(-60 + Math.random() * 150, 0.5, -95 + Math.random() * 45);
    s.rotation.y = Math.random() * Math.PI;
    g.add(s);
  }

  return g;
}