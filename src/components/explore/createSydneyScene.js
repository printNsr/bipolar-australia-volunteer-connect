import * as THREE from "three";
import { addSydneyLandmarks, material, mesh } from "./sydneyMapModels";

export default function createSydneyScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcfe7ea);
  scene.fog = new THREE.Fog(0xcfe7ea, 24, 48);

  const water = mesh(new THREE.CircleGeometry(24, 64), 0x78b8c4, [0, -.28, 0], [-Math.PI / 2, 0, 0]);
  water.material = new THREE.MeshStandardMaterial({ color: 0x78b8c4, roughness: .28, metalness: .08 });
  scene.add(water);

  const city = mesh(new THREE.CylinderGeometry(10.5, 11, .55, 8), 0xe8ddbf, [-.6, 0, 3.1]);
  scene.add(city);
  const north = mesh(new THREE.CylinderGeometry(8, 8.5, .5, 7), 0x86aa78, [-1.8, -.02, -7.7]);
  scene.add(north);

  const roads = new THREE.GridHelper(18, 15, 0xc9baa0, 0xd5c7ac);
  roads.position.set(-.7, .31, 3.1);
  scene.add(roads);

  const buildingMat = material(0xd7c9ac);
  for (let x = -7; x <= 5; x += 1.45) {
    for (let z = 0; z <= 8; z += 1.55) {
      if ((x + z) % 3 < .8) continue;
      const height = .35 + ((x * x + z * 7) % 10) / 9;
      const building = new THREE.Mesh(new THREE.BoxGeometry(.72, height, .72), buildingMat);
      building.position.set(x, .3 + height / 2, z);
      building.castShadow = true;
      scene.add(building);
    }
  }

  addSydneyLandmarks(scene);
  scene.add(new THREE.HemisphereLight(0xf7fbff, 0x66805d, 2.1));
  const sun = new THREE.DirectionalLight(0xfff2d0, 3.2);
  sun.position.set(-8, 14, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);
  return scene;
}