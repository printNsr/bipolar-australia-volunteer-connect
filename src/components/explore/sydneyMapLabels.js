import * as THREE from "three";
import { LANDMARKS } from "./landmarks";

function makeTexture(label, active) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "600 28px DM Sans, sans-serif";
  const width = Math.ceil(context.measureText(label).width) + 48;
  canvas.width = width;
  canvas.height = 58;
  context.fillStyle = active ? "#0A7A3A" : "rgba(255,255,255,.96)";
  context.beginPath();
  context.roundRect(1, 1, width - 2, 56, 28);
  context.fill();
  context.strokeStyle = active ? "#08602E" : "#DDE2DA";
  context.lineWidth = 2;
  context.stroke();
  context.font = "600 28px DM Sans, sans-serif";
  context.fillStyle = active ? "#FFFFFF" : "#1A1A1A";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, width / 2, 30);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, width };
}

export function addMapLabels(scene, countFor, selectedId) {
  LANDMARKS.forEach((landmark) => {
    const host = scene.getObjectByName(`landmark:${landmark.id}`);
    if (!host) return;
    const label = `${landmark.name} · ${countFor(landmark.id)}`;
    const { texture, width } = makeTexture(label, landmark.id === selectedId);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
    sprite.name = `label:${landmark.id}`;
    sprite.userData.landmarkId = landmark.id;
    sprite.position.set(0, landmark.height / 40 + 2.4, 0);
    sprite.scale.set(width / 55, 1.05, 1);
    sprite.renderOrder = 20;
    host.add(sprite);
  });
}

export function refreshMapLabels(scene, countFor, selectedId) {
  LANDMARKS.forEach((landmark) => {
    const sprite = scene.getObjectByName(`label:${landmark.id}`);
    if (!sprite) return;
    sprite.material.map.dispose();
    const { texture } = makeTexture(`${landmark.name} · ${countFor(landmark.id)}`, landmark.id === selectedId);
    sprite.material.map = texture;
    sprite.material.needsUpdate = true;
  });
}