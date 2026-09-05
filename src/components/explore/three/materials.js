import * as THREE from "three";

const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });

export const MAT = {
  land: std("#f4ecd8"),
  landSide: std("#ded2b8"),
  water: std("#7fb6cf", { roughness: 0.35, metalness: 0.15 }),
  road: std("#f8f4ea"),
  park: std("#aecb90"),
  sand: std("#f0dfb6"),
  stone: std("#e3d7c0"),
  sandstone: std("#d9c39c"),
  brick: std("#c1917a"),
  shell: std("#fbfaf6", { roughness: 0.5 }),
  steel: std("#8e9aa3", { roughness: 0.6, metalness: 0.3 }),
  roof: std("#7d8f86"),
  slate: std("#6f7c85"),
  glass: std("#a9c4cf", { roughness: 0.25, metalness: 0.4 }),
  trunk: std("#8b6a4b"),
  leaf: std("#7ba763"),
  leafDark: std("#5f8c52"),
  accent: std("#0a7a3a"),
  white: std("#ffffff"),
  hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
};

export function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function cyl(rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  return m;
}

export function cone(r, h, mat, x = 0, y = 0, z = 0, seg = 16) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  return m;
}

export function hitBox(w, h, d, y = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT.hit);
  m.position.y = y + h / 2;
  return m;
}