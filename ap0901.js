//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G184182021 岡本 陸
//
"use strict";

import * as THREE from "three";
import GUI from "ili-gui";
import { makeMetalRobot, makeCBRobot } from "./robot.js";

function init() {
  const param = { // カメラの設定値
    fov: 100, // 視野角
    x: 2,
    y: 50,
    z: 40,
  };

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);
  axes.visible = false;

  // ロボットの作成
  const robots = new THREE.Group();
  scene.add(robots);

  // キー入力イベントリスナーの追加
  window.addEventListener("keydown", (event) => {
    if (event.key.match(/^[a-zA-Z]$/)) {
      let robot;
      if (Math.random() < 0.01) {
        robot = makeCBRobot(); // 段ボールロボット
      } else {
        robot = makeMetalRobot(); // メタルロボット
      }

      const spawnRange = 100;

      const x = Math.random() * spawnRange - spawnRange / 2;
      const z = Math.random() * spawnRange - spawnRange / 2;
      robot.position.set(x, 0, z);
      
      robot.position.set(x, 0, z);
      robot.rotation.y = Math.atan2(x, z);

      robots.add(robot);
      console.log(`ロボットが追加されました: ${robots.children.length}体目`);
    }
  });


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// スポットライトの設定
const spotLight = new THREE.SpotLight(0xffffff, 1.5);
spotLight.position.set(30, 50, 30);
spotLight.castShadow = true;
scene.add(spotLight);

// 指向性ライト（オプション）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 50, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

  // 床の作成
const floorSize = 100;
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0.0,
});

const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const loader = new THREE.TextureLoader();
const texture = loader.load("./studio_small_08.jpg", () => {
  scene.background = texture; // 直接背景に設定
});

scene.background = new THREE.Color(0xffffff); // 背景を白に設定


let pressCount = 0;
let gameTime = 10; // 制限時間（秒）
let timerInterval;

function startKeyPressGame() {
  pressCount = 0;
  gameTime = 14;

  // タイマー表示を初期化
  const timerElement = document.getElementById("timer");
  timerElement.innerHTML = `残り時間: ${gameTime}秒`;

  // タイマー開始
  timerInterval = setInterval(() => {
    gameTime--;
    timerElement.innerHTML = `残り時間: ${gameTime}秒`;

    if (gameTime <= 0) {
      clearInterval(timerInterval);
      alert("時間切れ！ゲームオーバー！");
      timerElement.innerHTML = ""; // タイマー表示を消去
      resetGame();
    }
  }, 1000);

  // キーボード入力イベント
  window.addEventListener("keydown", handleKeyPressGame);
}


function handleKeyPressGame() {
  pressCount++;
  console.log(`キーを押した回数: ${pressCount}`);

  if (pressCount >= 100) {
    clearInterval(timerInterval);
    alert("クリア");
    resetGame();
  }
}

function resetGame() {
  pressCount = 0;
  clearInterval(timerInterval);
  console.log("ゲームがリセットされました");
}

let dangerKey;

function startDangerKeyGame() {
  // ランダムなキーを選択
  const possibleKeys = "abcdefghijklmnopqrstuvwxyz".split("");
  dangerKey = possibleKeys[Math.floor(Math.random() * possibleKeys.length)];

  console.log(`ゲームオーバーキー: ${dangerKey}`);

  // キーボード入力イベント
  window.addEventListener("keydown", handleDangerKeyGame);
}

function handleDangerKeyGame(event) {
  if (event.key === dangerKey) {
    alert(`ゲームオーバー！${dangerKey} を押しました！`);
    resetGame();
  } else {
    console.log(`${event.key} を押しました`);
  }
}



document.getElementById("key-press-game").addEventListener("click", () => {
  console.log("キー押しゲーム開始！");
  startKeyPressGame();
});

document.getElementById("danger-key-game").addEventListener("click", () => {
  console.log("危険キーゲーム開始！");
  startDangerKeyGame();
});


  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    param.fov, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 10, 50); // カメラ位置を調整
  camera.lookAt(0, 0, 0);
  
  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x104040);
  renderer.shadowMap.enabled = true;
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  // 描画関数の定義
  function render() {
    camera.fov = param.fov;
    camera.position.x = param.x;
    camera.position.y = param.y;
    camera.position.z = param.z;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    robots.children.forEach((robot) => {
      robot.rotation.y = (robot.rotation.y + 0.01) % (2 * Math.PI);
      robot.position.y = Math.sin(robot.rotation.y);
    });

    const gui = new GUI();
    gui.add(param, "fov", 10, 100);
    gui.add(param, "x", -50, 50);
    gui.add(param, "y", -50, 50);
    gui.add(param, "z", -50, 50);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}

init();
