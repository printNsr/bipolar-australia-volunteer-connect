import * as THREE from "three";

const material = (color, roughness = 0.72, metalness = 0.04) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const mesh = (geometry, color, position, rotation = [0, 0, 0]) => {
  const item = new THREE.Mesh(geometry, material(color));
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
};

const group = (scene, id, position) => {
  const landmark = new THREE.Group();
  landmark.name = `landmark:${id}`;
  landmark.userData.landmarkId = id;
  landmark.position.set(...position);
  scene.add(landmark);
  return landmark;
};

export function addSydneyLandmarks(scene) {
  const opera = group(scene, "opera_house", [4.7, 0.35, -2.1]);
  opera.add(mesh(new THREE.BoxGeometry(3.2, .3, 1.6), 0xd8b98e, [0, .15, 0]));
  [[-.95,.65,.22],[-.28,.9,.05],[.48,.78,-.05],[1.05,.55,-.2]].forEach(([x,s,z]) => {
    const sail = mesh(new THREE.ConeGeometry(s, 2.5*s, 4), 0xfffdf3, [x, 1.05*s+.25, z], [0, .2, -.2]);
    opera.add(sail);
  });

  const bridge = group(scene, "harbour_bridge", [-2.7, 0, -3.1]);
  bridge.add(mesh(new THREE.BoxGeometry(6.8, .24, .72), 0x48545a, [0, 1.2, 0]));
  [-2.7, 2.7].forEach(x => bridge.add(mesh(new THREE.BoxGeometry(.55, 2.6, .8), 0xb59a7a, [x, 1.3, 0])));
  const archCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-3.1,1.25,0),new THREE.Vector3(0,4.15,0),new THREE.Vector3(3.1,1.25,0)]);
  bridge.add(mesh(new THREE.TubeGeometry(archCurve, 36, .14, 8, false), 0x3f4b51, [0,0,0]));

  const tower = group(scene, "sydney_tower", [-2.2, 0, 1.6]);
  tower.add(mesh(new THREE.CylinderGeometry(.15,.22,4.5,12), 0xb5aaa0, [0,2.25,0]));
  tower.add(mesh(new THREE.SphereGeometry(.6,18,12), 0xcaa43d, [0,4.35,0]));
  tower.add(mesh(new THREE.ConeGeometry(.08,1.8,8), 0x75706b, [0,5.65,0]));

  const qvb = group(scene, "qvb", [-3.7, 0, 3.5]);
  qvb.add(mesh(new THREE.BoxGeometry(2.7,1.3,1.25), 0xb16d50, [0,.65,0]));
  qvb.add(mesh(new THREE.SphereGeometry(.52,16,10,0,Math.PI*2,0,Math.PI/2), 0x60837b, [0,1.3,0]));

  const luna = group(scene, "luna_park", [.4, 0, -4.2]);
  luna.add(mesh(new THREE.TorusGeometry(1.05,.08,8,32), 0xe2d8c5, [0,1.3,0], [0,0,0]));
  luna.add(mesh(new THREE.BoxGeometry(2.5,.35,1), 0xc95f55, [0,.18,0]));

  const bondi = group(scene, "bondi", [7.2, 0, 3.7]);
  bondi.add(mesh(new THREE.BoxGeometry(2.4,1.05,1.3), 0xf2e7cc, [0,.52,0]));
  bondi.add(mesh(new THREE.BoxGeometry(1.1,.35,1.45), 0x72a3a2, [0,1.2,0]));

  const quay = group(scene, "circular_quay", [2.1, 0, -.35]);
  quay.add(mesh(new THREE.BoxGeometry(3.2,.45,1), 0x9d7655, [0,.22,0]));
  [-1.1,0,1.1].forEach(x => quay.add(mesh(new THREE.BoxGeometry(.45,.32,1.9), 0xd9ece7, [x,.12,-1])));
}

export { material, mesh };