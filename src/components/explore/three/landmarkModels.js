import * as THREE from "three";
import { MAT, box, cyl, cone, hitBox } from "./materials";

function shell(size, tilt, rotY) {
  const geo = new THREE.SphereGeometry(size, 28, 20, 0, Math.PI * 0.62, 0, Math.PI * 0.5);
  const m = new THREE.Mesh(geo, MAT.shell);
  m.scale.set(1, 1.5, 0.55);
  m.rotation.set(tilt, rotY, 0);
  m.castShadow = true;
  return m;
}

export function operaHouse() {
  const g = new THREE.Group();
  g.add(box(26, 2.4, 15, MAT.stone, 0, 0, 0));
  g.add(box(22, 1.4, 12, MAT.sandstone, 0, 2.4, 0));

  const sizes = [5.4, 4.4, 3.3, 2.3];
  sizes.forEach((s, i) => {
    const m = shell(s, -0.18, -Math.PI / 2 + 0.15);
    m.position.set(-6 + i * 4.2, 3.6, 2.2 - i * 0.5);
    g.add(m);
  });
  [3.2, 2.3, 1.6].forEach((s, i) => {
    const m = shell(s, -0.2, -Math.PI / 2 - 0.35);
    m.position.set(-1 + i * 2.6, 3.6, -4 + i * 0.3);
    g.add(m);
  });
  g.add(hitBox(28, 18, 18));
  return g;
}

export function harbourBridge() {
  const g = new THREE.Group();
  const span = 46;

  // arch (two parallel ribs)
  [-3.2, 3.2].forEach((off) => {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(span / 2, 0.75, 8, 40, Math.PI), MAT.steel);
    arch.rotation.y = Math.PI / 2;
    arch.position.set(off, 2, 0);
    arch.castShadow = true;
    g.add(arch);
  });
  // cross bracing
  for (let i = -5; i <= 5; i++) {
    const a = (i / 5) * (Math.PI / 2) * 0.9;
    const x = Math.sin(a) * (span / 2);
    const y = Math.cos(a) * (span / 2) + 2;
    const b = box(7, 0.5, 0.5, MAT.steel, 0, y, x);
    g.add(b);
    const hang = box(0.4, Math.max(y - 9, 0.5), 0.4, MAT.steel, 0, 9, x);
    g.add(hang);
  }
  // deck
  const deck = box(9, 1.2, span + 22, MAT.slate, 0, 8.5, 0);
  g.add(deck);
  // pylons
  [-1, 1].forEach((s) => {
    [-4.6, 4.6].forEach((x) => {
      g.add(box(4, 17, 5, MAT.sandstone, x, 0, s * (span / 2 - 1)));
      g.add(box(4.6, 1.2, 5.6, MAT.stone, x, 17, s * (span / 2 - 1)));
    });
  });
  g.add(hitBox(12, 26, span + 10));
  return g;
}

export function circularQuay() {
  const g = new THREE.Group();
  g.add(box(24, 1.6, 8, MAT.stone, 0, 0, 0));
  for (let i = 0; i < 4; i++) g.add(box(3.6, 3, 7, MAT.white, -9 + i * 6, 1.6, -3));
  for (let i = 0; i < 4; i++) g.add(box(3.6, 0.6, 7.4, MAT.roof, -9 + i * 6, 4.6, -3));
  // ferry
  const ferry = new THREE.Group();
  ferry.add(box(3.6, 1.6, 9, MAT.white, 0, 0, 0));
  ferry.add(box(2.4, 1.4, 5, MAT.stone, 0, 1.6, 0));
  ferry.add(cyl(0.5, 0.5, 2, MAT.accent, 0, 3, 0, 10));
  ferry.position.set(9, 0.4, -8);
  ferry.rotation.y = 0.3;
  g.add(ferry);
  g.add(hitBox(26, 10, 16));
  return g;
}

export function sydneyTower() {
  const g = new THREE.Group();
  g.add(box(12, 12, 12, MAT.sandstone, 0, 0, 0));
  g.add(cyl(1.1, 1.5, 34, MAT.stone, 0, 12, 0, 14));
  const turret = cyl(3.4, 4.2, 6, MAT.accent, 0, 44, 0, 18);
  g.add(turret);
  g.add(cyl(3.6, 3.6, 1, MAT.glass, 0, 46, 0, 18));
  g.add(cone(0.9, 12, MAT.steel, 0, 50, 0, 10));
  g.add(hitBox(14, 62, 14));
  return g;
}

export function qvb() {
  const g = new THREE.Group();
  g.add(box(30, 9, 15, MAT.sandstone, 0, 0, 0));
  g.add(box(31, 1, 16, MAT.stone, 0, 9, 0));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.roof);
  dome.position.set(0, 10, 0);
  dome.castShadow = true;
  g.add(dome);
  g.add(cyl(0.4, 0.4, 3, MAT.stone, 0, 15, 0, 8));
  [-11, 11].forEach((x) => {
    const d = new THREE.Mesh(new THREE.SphereGeometry(2.4, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.roof);
    d.position.set(x, 10, 0);
    g.add(d);
  });
  for (let i = 0; i < 7; i++) g.add(cyl(0.5, 0.5, 8, MAT.stone, -12 + i * 4, 0, 8, 8));
  g.add(hitBox(32, 20, 18));
  return g;
}

export function stMarys() {
  const g = new THREE.Group();
  g.add(box(11, 12, 26, MAT.brick, 0, 0, 0));
  const roof = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 26), MAT.slate);
  roof.rotation.z = Math.PI / 4;
  roof.position.set(0, 15, 0);
  roof.scale.set(1, 0.7, 1);
  roof.castShadow = true;
  g.add(roof);
  g.add(box(18, 10, 9, MAT.brick, 0, 0, -11));
  [-6.5, 6.5].forEach((x) => {
    g.add(box(5, 17, 5, MAT.brick, x, 0, -12));
    g.add(cone(3.6, 10, MAT.slate, x, 17, -12, 4));
  });
  g.add(cone(2.4, 8, MAT.slate, 0, 18, 6, 4));
  g.add(hitBox(22, 28, 30));
  return g;
}

export function lunaPark() {
  const g = new THREE.Group();
  // face arch
  const arch = new THREE.Mesh(new THREE.TorusGeometry(5, 1.6, 10, 24, Math.PI), MAT.white);
  arch.position.set(0, 6, 0);
  g.add(arch);
  g.add(box(12, 6, 3, MAT.white, 0, 0, 0));
  [-6.5, 6.5].forEach((x) => {
    g.add(cyl(1, 1.4, 12, MAT.stone, x, 0, 0, 10));
    g.add(cone(1.4, 3, MAT.accent, x, 12, 0, 10));
  });
  // ferris wheel
  const wheel = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(7, 0.35, 8, 30), MAT.steel);
  wheel.add(rim);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const spoke = box(0.25, 14, 0.25, MAT.steel, 0, -7, 0);
    spoke.rotation.z = a;
    wheel.add(spoke);
    const cab = box(1.3, 1.3, 1.3, i % 2 ? MAT.accent : MAT.white, Math.cos(a) * 7, Math.sin(a) * 7 - 0.65, 0);
    wheel.add(cab);
  }
  wheel.position.set(12, 9, -4);
  g.add(wheel);
  [10, 14].forEach((x) => g.add(box(0.7, 9, 0.7, MAT.steel, x, 0, -4)));
  g.add(hitBox(30, 22, 16, 0));
  g.userData.wheel = wheel;
  return g;
}

export function bondiPavilion() {
  const g = new THREE.Group();
  g.add(box(20, 6, 10, MAT.stone, 0, 0, 0));
  g.add(box(21, 1.2, 11, MAT.roof, 0, 6, 0));
  const arch = new THREE.Mesh(new THREE.TorusGeometry(3, 0.8, 8, 20, Math.PI), MAT.white);
  arch.position.set(0, 6, 5.4);
  g.add(arch);
  [-7, 7].forEach((x) => g.add(box(3.4, 8, 3.4, MAT.stone, x, 0, 0)));
  g.add(hitBox(24, 12, 14));
  return g;
}

export const BUILDERS = {
  opera_house: operaHouse,
  harbour_bridge: harbourBridge,
  circular_quay: circularQuay,
  sydney_tower: sydneyTower,
  qvb,
  st_marys: stMarys,
  luna_park: lunaPark,
  bondi: bondiPavilion
};