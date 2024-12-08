//
// 応用プログラミング (robot)
// G184182021 岡本陸
//
"use strict";

import * as THREE from "three";

const seg = 12; // 円や円柱の分割数
const gap = 0.01; // 胸のマークなどを浮かせる高さ


// メタルロボット
export function makeMetalRobot() {
  const metalRobot = new THREE.Group();

  // 環境反射用のマテリアル（高光沢の金属感）
  const enhancedMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030, // 暗めの金属色
    roughness: 0.2,  // 少し光沢感を残す
    metalness: 1,    // 完全な金属感
  });

  // アクセントカラー（赤色のパーツ用）
  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500, // 鮮やかなオレンジ系の赤
    metalness: 0.8,
    roughness: 0.4,
  });

  // 光るエフェクト用の青い素材
  const glowingBlueMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff, // 青
    emissive: 0x0077ff, // 自発光色
  });

  // **脚の作成**
  const legRad = 0.6, legLen = 4, legSep = 1.5;
  const legGeometry = new THREE.CylinderGeometry(legRad, legRad, legLen, 32);
  const legR = new THREE.Mesh(legGeometry, enhancedMetalMaterial);
  legR.position.set(-legSep / 2, legLen / 2, 0);
  metalRobot.add(legR);
  const legL = legR.clone();
  legL.position.set(legSep / 2, legLen / 2, 0);
  metalRobot.add(legL);

  // **胴体の作成**
  const bodyW = 3.5, bodyH = 5, bodyD = 2.5;
  const bodyGeometry = new THREE.BoxGeometry(bodyW, bodyH, bodyD);
  const body = new THREE.Mesh(bodyGeometry, enhancedMetalMaterial);

  // 胸部のエネルギーコア
  const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const core = new THREE.Mesh(coreGeometry, glowingBlueMaterial);
  core.position.set(0, bodyH / 4, bodyD / 2 + 0.1);
  body.add(core);

  body.position.y = legLen + bodyH / 2;
  metalRobot.add(body);

  // **腕の作成**
  const armRad = 0.5, armLen = 4.5;
  const armGeometry = new THREE.CylinderGeometry(armRad, armRad, armLen, 32);
  const armL = new THREE.Mesh(armGeometry, enhancedMetalMaterial);
  armL.position.set(bodyW / 2 + armRad, legLen + bodyH - armLen / 2, 0);
  armL.rotation.z = Math.PI / 8;
  metalRobot.add(armL);
  const armR = armL.clone();
  armR.position.set(-(bodyW / 2 + armRad), legLen + bodyH - armLen / 2, 0);
  armR.rotation.z = -Math.PI / 8;
  metalRobot.add(armR);

  // **頭部の作成**
  const headRad = 1.5;
  const head = new THREE.Group();

  // 頭の球体部分
  const headGeometry = new THREE.SphereGeometry(headRad, 32, 32);
  const headMesh = new THREE.Mesh(headGeometry, enhancedMetalMaterial);
  head.add(headMesh);

  // 顔の青いライン
  const faceLineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const faceLine = new THREE.Mesh(faceLineGeometry, glowingBlueMaterial);
  faceLine.rotation.z = Math.PI / 2;
  faceLine.position.set(0, 0.5, headRad - 0.1);
  head.add(faceLine);

  // 頭部のアンテナ
  const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
  const antenna = new THREE.Mesh(antennaGeometry, redMaterial);
  antenna.position.set(0, headRad + 1.2, 0);
  head.add(antenna);

  head.position.y = legLen + bodyH + headRad;
  metalRobot.add(head);

  // **肩のパーツ追加**
  const shoulderRad = 0.7, shoulderW = 1.5;
  const shoulderGeometry = new THREE.SphereGeometry(shoulderRad, 16, 16, 0, Math.PI);
  const shoulderL = new THREE.Mesh(shoulderGeometry, redMaterial);
  shoulderL.position.set(bodyW / 2 + shoulderRad / 2, legLen + bodyH - shoulderW, 0);
  metalRobot.add(shoulderL);
  const shoulderR = shoulderL.clone();
  shoulderR.position.x = -(bodyW / 2 + shoulderRad / 2);
  metalRobot.add(shoulderR);

  // **影の設定**
  metalRobot.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return metalRobot;
}

// 段ボールロボット
export function makeCBRobot() {
  const cardboardRobot = new THREE.Group();

  // 段ボール素材
  const textureLoader = new THREE.TextureLoader();
  const cardboardTexture = textureLoader.load("path/cardboard_texture.jpg");
  const cardboardMaterial = new THREE.MeshLambertMaterial({
    map: cardboardTexture,
    color: 0xccaa77,
  });

  // 脚の作成
  const legW = 0.8, legLen = 3, legSep = 1.2;
  const legGeometry = new THREE.BoxGeometry(legW, legLen, legW);
  const legL = new THREE.Mesh(legGeometry, cardboardMaterial);
  legL.position.set(-legSep / 2, legLen / 2, 0);
  cardboardRobot.add(legL);
  const legR = legL.clone();
  legR.position.set(legSep / 2, legLen / 2, 0);
  cardboardRobot.add(legR);

  // 胴体の作成
  const bodyW = 2.2, bodyH = 3, bodyD = 2;
  const bodyGeometry = new THREE.BoxGeometry(bodyW, bodyH, bodyD);
  const body = new THREE.Mesh(bodyGeometry, cardboardMaterial);
  body.position.y = legLen + bodyH / 2;
  cardboardRobot.add(body);

  // 腕の作成
  const armW = 0.8, armLen = 3.8;
  const armGeometry = new THREE.BoxGeometry(armW, armLen, armW);
  const armL = new THREE.Mesh(armGeometry, cardboardMaterial);
  armL.position.set(bodyW / 2 + armW / 2, legLen + bodyH - armLen / 2, 0);
  cardboardRobot.add(armL);
  const armR = armL.clone();
  armR.position.set(-(bodyW / 2 + armW / 2), legLen + bodyH - armLen / 2, 0);
  cardboardRobot.add(armR);

  // 頭の作成
  const headW = 4, headH = 2.4, headD = 2.4;
  const headGeometry = new THREE.BoxGeometry(headW, headH, headD);
  const head = new THREE.Mesh(headGeometry, cardboardMaterial);
  head.position.y = legLen + bodyH + headH / 2;
  cardboardRobot.add(head);

  return cardboardRobot;
}
