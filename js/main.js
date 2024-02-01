import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { HorizontalBlurShader } from "three/addons/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/addons/shaders/VerticalBlurShader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

let camera, scene, renderer, stats, gui, renderPass, outlinePass, composer;
let selectedObject;

const mouse = new THREE.Vector2();
const gltfLoader = new GLTFLoader();

const meshes = [];
const meshData = [
  {
    x: -0.9,
    y: 0.025,
    z: -0.7,
    gx: 0.15,
    gy: 0.05,
    gz: 0.3,
    label: "RECEIVING",
    color: "#ff864f",
    textColor: "#ffffff",
  },
  {
    x: -0.4,
    y: 0.025,
    z: -0.8,
    gx: 0.4,
    gy: 0.05,
    gz: 0.4,
    label: "QUALTIY\nCONTROL",
    color: "#fffa00",
    textColor: "#ffffff",
  },
  {
    x: 0.5,
    y: 0.025,
    z: -0.75,
    gx: 1,
    gy: 0.05,
    gz: 0.5,
    label: "RAW\nMATERIALS\nSTORE",
    color: "#c0d0ff",
    textColor: "#ffffff",
  },
  {
    x: 0.7,
    y: 0.025,
    z: -0.1,
    gx: 0.6,
    gy: 0.05,
    gz: 0.6,
    label: "WORK IN\nPROGRESS",
    color: "#ff879c",
    textColor: "#ffffff",
  },

  {
    x: 0.15,
    y: 0.025,
    z: -0.1,
    gx: 0.3,
    gy: 0.05,
    gz: 0.3,
    label: "QUALITY\nCONTROL",
    color: "#7ff79c",
    textColor: "#ffffff",
  },
  {
    x: -0.6,
    y: 0.025,
    z: 0.25,
    gx: 0.7,
    gy: 0.05,
    gz: 0.5,
    label: "FINISHED\nGOODS STORE",
    color: "#50a7fc",
    textColor: "#ffffff",
  },
  {
    x: 0.85,
    y: 0.025,
    z: 0.5,
    gx: 0.3,
    gy: 0.05,
    gz: 0.4,
    label: "SERVICES",
    color: "#a684bc",
    textColor: "#ffffff",
  },
  {
    x: 0.75,
    y: 0.025,
    z: 0.9,
    gx: 0.3,
    gy: 0.05,
    gz: 0.15,
    label: "REPAIRS",
    color: "#ff864f",
    textColor: "#ffffff",
  },
  {
    x: 0.3,
    y: 0.025,
    z: 0.9,
    gx: 0.3,
    gy: 0.05,
    gz: 0.15,
    label: "POINT OF\nSALE",
    color: "#56c5bf",
    textColor: "#ffffff",
  },
  {
    x: -0.15,
    y: 0.025,
    z: 0.9,
    gx: 0.3,
    gy: 0.05,
    gz: 0.15,
    label: "DESPATCH",
    color: "#8effb2",
    textColor: "#ffffff",
  },
];

const labelData = [
  {
    x: -1.2,
    y: 0.2,
    z: -0.3,
    label: "PURCHASE ORDERS\nSUPPLIER RETURNS\nREPORTS\nGRN's",
    color: "#ff864f",
    textColor: "#469ff3",
  },
  {
    x: 0.8,
    y: 0.2,
    z: -1.2,
    label: "KITTING\nITEM MASTER & B.O.M.'S\nSTORES BINS\nINTERNAL TRANSFERES",
    color: "#ff864f",
    textColor: "#469ff3",
  },
  {
    x: 1.2,
    y: 0.2,
    z: -0.2,
    label: "PRODUCTION LINES\nMANUFACTURING\nSERIAL NUMBERS\nWORKS ORDERS",
    color: "#ff864f",
    textColor: "#469ff3",
  },
  {
    x: 1.2,
    y: 0.2,
    z: 0.5,
    label: "PROJECTS\nTASKS\nREPORTS",
    color: "#ff864f",
    textColor: "#469ff3",
  },
  {
    x: 0.2,
    y: 0.2,
    z: 0.5,
    label: "STORES\nDASHBOARD\n(PICK/PACK\nSLIPS)",
    color: "#ff864f",
    textColor: "#469ff3",
  },
  {
    x: -0.5,
    y: 0.2,
    z: 1.2,
    label: "DELIVERY NOTES\nBRANCH TRANSFERS",
    color: "#ff864f",
    textColor: "#469ff3",
  },

  {
    x: 0.2,
    y: 0.2,
    z: 1.2,
    label: "SALES ORDERS\nQUOTES",
    color: "#ff864f",
    textColor: "#469ff3",
  },

  {
    x: 0.8,
    y: 0.2,
    z: 1.2,
    label: "JOB CARDS\nCUSTOMER RETURNS",
    color: "#ff864f",
    textColor: "#469ff3",
  },
];

const arrowData = [
  {
    x: -1.1,
    y: 0.04,
    z: -0.75,
    angle: 0,
  },
  {
    x: -0.7,
    y: 0.04,
    z: -0.85,
    angle: 0,
  },
  {
    x: -0.1,
    y: 0.04,
    z: -0.85,
    angle: 0,
  },
  {
    x: 0.8,
    y: 0.04,
    z: -0.45,
    angle: 90,
  },
  {
    x: 0.4,
    y: 0.04,
    z: -0.1,
    angle: 180,
  },
  {
    x: -0.1,
    y: 0.04,
    z: -0,
    angle: 180,
  },
  {
    x: -0.5,
    y: 0.04,
    z: -0.2,
    angle: 90,
  },
  {
    x: -0.2,
    y: 0.04,
    z: 0.6,
    angle: 90,
  },
  {
    x: -0.15,
    y: 0.04,
    z: 1.1,
    angle: 90,
  },

  {
    x: 0.8,
    y: 0.04,
    z: 1.3,
    angle: 270,
  },
];

const truckData = [
  {
    x: -1.3,
    y: 0.15,
    z: -0.75,
    angle: 0,
  },

  {
    x: -0.15,
    y: 0.15,
    z: 1.35,
    angle: 90,
  },
];

const wallData = [
  {
    x: 0,
    y: 0.1,
    z: -1,
    gx: 2,
    gy: 0.2,
    gz: 0.01,
  },
  {
    x: 0,
    y: 0.1,
    z: 1,
    gx: 2,
    gy: 0.2,
    gz: 0.01,
  },
  {
    x: 1,
    y: 0.1,
    z: 0,
    gx: 0.01,
    gy: 0.2,
    gz: 2,
  },
  {
    x: -1,
    y: 0.1,
    z: 0,
    gx: 0.01,
    gy: 0.2,
    gz: 2,
  },
];

const textmeshes = [];
const labelmeshes = [];

const PLANE_WIDTH = 2.5;
const PLANE_HEIGHT = 2.5;
const CAMERA_HEIGHT = 0.3;

const state = {
  shadow: {
    blur: 3.5,
    darkness: 1,
    opacity: 1,
  },
  plane: {
    color: "#ffffff",
    opacity: 0.2,
  },
  showWireframe: false,
};

let shadowGroup,
  renderTarget,
  renderTargetBlur,
  shadowCamera,
  cameraHelper,
  depthMaterial,
  horizontalBlurMaterial,
  verticalBlurMaterial;

let plane, blurPlane, fillPlane;

const raycaster = new THREE.Raycaster();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(
    -1.6403354936265144,
    1.5734888238175365,
    1.81567067274199
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);

  const ambientlight = new THREE.AmbientLight(0xffffff);
  ambientlight.intensity = 4;
  scene.add(ambientlight);

  // the container, if you need to move the plane just move this
  shadowGroup = new THREE.Group();
  shadowGroup.position.y = -0.3;
  scene.add(shadowGroup);

  // the render target that will show the shadows in the plane texture
  renderTarget = new THREE.WebGLRenderTarget(512, 512);
  renderTarget.texture.generateMipmaps = false;

  // the render target that we will use to blur the first render target
  renderTargetBlur = new THREE.WebGLRenderTarget(512, 512);
  renderTargetBlur.texture.generateMipmaps = false;

  // make a plane and make it face up
  const planeGeometry = new THREE.PlaneGeometry(
    PLANE_WIDTH,
    PLANE_HEIGHT
  ).rotateX(Math.PI / 2);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
    opacity: state.shadow.opacity,
    transparent: true,
    depthWrite: false,
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // make sure it's rendered after the fillPlane
  plane.renderOrder = 1;
  // shadowGroup.add(plane);

  // the y from the texture is flipped!
  plane.scale.y = -0.1;

  // the plane onto which to blur the texture
  blurPlane = new THREE.Mesh(planeGeometry);
  blurPlane.visible = false;
  // shadowGroup.add(blurPlane);

  // the plane with the color of the ground
  const fillPlaneMaterial = new THREE.MeshBasicMaterial({
    color: state.plane.color,
    opacity: state.plane.opacity,
    transparent: true,
    depthWrite: false,
  });
  fillPlane = new THREE.Mesh(planeGeometry, fillPlaneMaterial);
  fillPlane.rotateX(Math.PI);
  // shadowGroup.add(fillPlane);

  // the camera to render the depth material from
  shadowCamera = new THREE.OrthographicCamera(
    -PLANE_WIDTH / 2,
    PLANE_WIDTH / 2,
    PLANE_HEIGHT / 2,
    -PLANE_HEIGHT / 2,
    0,
    CAMERA_HEIGHT
  );
  shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
  shadowGroup.add(shadowCamera);

  cameraHelper = new THREE.CameraHelper(shadowCamera);

  // like MeshDepthMaterial, but goes from black to transparent
  depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.userData.darkness = { value: state.shadow.darkness };
  depthMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.darkness = depthMaterial.userData.darkness;
    shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(
              "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
              "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );"
            )}
					`;
  };

  depthMaterial.depthTest = false;
  depthMaterial.depthWrite = false;

  horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
  horizontalBlurMaterial.depthTest = false;

  verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
  verticalBlurMaterial.depthTest = false;

  addMeshes();
  //

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // composer = new EffectComposer(renderer);

  // renderPass = new RenderPass(scene, camera);
  // outlinePass = new OutlinePass(
  //   new THREE.Vector2(window.innerWidth, window.innerHeight),
  //   scene,
  //   camera
  // );
  // outlinePass.renderToScreen = true;

  // // composer.addPass(renderPass);
  // // composer.addPass(outlinePass);

  // var params = {
  //   edgeStrength: 2,
  //   edgeGlow: 1,
  //   edgeThickness: 1.0,
  //   pulsePeriod: 0,
  //   usePatternTexture: false,
  // };
  // // outlinePass.renderToScreen = true;
  // outlinePass.edgeStrength = params.edgeStrength;
  // outlinePass.edgeGlow = params.edgeGlow;
  // outlinePass.visibleEdgeColor.set(0xffffff);
  // outlinePass.hiddenEdgeColor.set(0xffffff);

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("click", onMouseClick, false);

  document.body.appendChild(renderer.domElement);

  let orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enabled = false;

  // new OrbitControls(camera, renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// renderTarget --> blurPlane (horizontalBlur) --> renderTargetBlur --> blurPlane (verticalBlur) --> renderTarget
function blurShadow(amount) {
  blurPlane.visible = true;

  // blur horizontally and draw in the renderTargetBlur
  blurPlane.material = horizontalBlurMaterial;
  blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture;
  horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

  renderer.setRenderTarget(renderTargetBlur);
  renderer.render(blurPlane, shadowCamera);

  // blur vertically and draw in the main renderTarget
  blurPlane.material = verticalBlurMaterial;
  blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture;
  verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

  renderer.setRenderTarget(renderTarget);
  renderer.render(blurPlane, shadowCamera);

  blurPlane.visible = false;
}

function checkIntersection() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(scene, true);
  if (intersects.length > 0 && intersects[0].object.name.indexOf("mesh") == 0) {
    const selectedObj = intersects[0].object;
    let objName = selectedObj.name;
    selectedObject = Number(objName.split("-")[1]);

    const color = meshData[selectedObject].color;

    meshes[selectedObject].material.color = new THREE.Color(
      shadeColor(color, -15)
    );
    // outlinePass.selectedObjects = selectedObjects;
  } else {
    if (selectedObject > -1) {
      meshes[selectedObject].material.color = new THREE.Color(
        shadeColor(meshData[selectedObject].color, 0)
      );

      selectedObject = -1;
    }
    // outlinePass.selectedObjects = [];
  }
  return selectedObject;
}

function shadeColor(color, percent) {
  // deprecated. See below.
  var num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;

  return (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  );
}

function onMouseClick(event) {
  // if (event.isPrimary === false) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  let activeItem = checkIntersection();
  
  if (activeItem >= 0) {
    window.open(
      "https://example.com",
      "_blank" // <- This is what makes it open in a new window.
    );
  }
}

function onPointerMove(event) {
  if (event.isPrimary === false) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  checkIntersection();
}

function animate() {
  requestAnimationFrame(animate);

  // remove the background
  const initialBackground = scene.background;
  scene.background = null;

  // force the depthMaterial to everything
  cameraHelper.visible = false;
  scene.overrideMaterial = depthMaterial;

  // set renderer clear alpha
  const initialClearAlpha = renderer.getClearAlpha();
  renderer.setClearAlpha(0);

  // render to the render target to get the depths
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, shadowCamera);

  // and reset the override material
  scene.overrideMaterial = null;
  cameraHelper.visible = true;

  blurShadow(state.shadow.blur);

  // a second pass to reduce the artifacts
  // (0.4 is the minimum blur amout so that the artifacts are gone)
  blurShadow(state.shadow.blur * 0.4);

  // reset and render the normal scene
  renderer.setRenderTarget(null);
  renderer.setClearAlpha(initialClearAlpha);
  scene.background = initialBackground;

  for (let i = 0, l = labelmeshes.length; i < l; i++) {
    labelmeshes[i].rotation.setFromRotationMatrix(camera.matrix);
  }

  renderer.render(scene, camera);
  // composer.render(scene, camera);

  stats.update();
}

function addMeshes() {
  const size = 2;
  const divisions = 16;

  const gridHelper = new THREE.GridHelper(size, divisions, '#d2e5f0', '#d2e5f0');
  gridHelper.raycast = function () {};
  scene.add(gridHelper);

  // const axesHelper = new THREE.AxesHelper(1);
  // scene.add(axesHelper);

  // add the example meshes

  for (let i = 0, l = meshData.length; i < l; i++) {
    const angle = (i / l) * Math.PI * 2;

    const geometry = new THREE.BoxGeometry(
      meshData[i].gx,
      meshData[i].gy,
      meshData[i].gz
    );

    const material = new THREE.MeshMatcapMaterial({ color: meshData[i].color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = meshData[i].y;
    mesh.position.x = meshData[i].x;
    mesh.position.z = meshData[i].z;
    mesh.name = "mesh-" + i;
    scene.add(mesh);
    meshes.push(mesh);
  }

  for (let i = 0, l = wallData.length; i < l; i++) {
    const angle = (i / l) * Math.PI * 2;

    const geometry = new THREE.BoxGeometry(
      wallData[i].gx,
      wallData[i].gy,
      wallData[i].gz
    );

    const material = new THREE.MeshStandardMaterial({ color: '#0050ff' , opacity: 0.2,         transparent: true,  });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = wallData[i].y;
    mesh.position.x = wallData[i].x;
    mesh.position.z = wallData[i].z;
    mesh.raycast = function () {};
    scene.add(mesh);
    meshes.push(mesh);
  }


  const loader = new FontLoader();

  loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    for (let i = 0, l = meshData.length; i < l; i++) {
      const textGeo = new TextGeometry(meshData[i].label, {
        font: font,
        size: 0.03,
        height: 0.001,
      });
      textGeo.computeBoundingBox();
      const offset = textGeo.boundingBox
        .getCenter(new THREE.Vector3())
        .negate();
      textGeo.translate(offset.x, offset.y, offset.z);

      const textMaterial = new THREE.LineBasicMaterial({
        color: meshData[i].textColor,
        side: THREE.DoubleSide,
      });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      const angle = -Math.PI / 2;
      textMesh.rotateX(angle);

      if (i == 0) textMesh.rotateZ(angle);
      textMesh.position.y = meshData[i].y + meshData[i].gy;
      textMesh.position.x = meshData[i].x;
      textMesh.position.z = meshData[i].z;

      scene.add(textMesh);
      textmeshes.push(textMesh);
    }

    for (let i = 0, l = labelData.length; i < l; i++) {
      const textGeo = new TextGeometry(labelData[i].label, {
        font: font,
        size: 0.03,
        height: 0.001,
      });
      textGeo.computeBoundingBox();
      const offset = textGeo.boundingBox
        .getCenter(new THREE.Vector3())
        .negate();
      textGeo.translate(offset.x, offset.y, offset.z);

      const textMaterial = new THREE.LineBasicMaterial({
        color: labelData[i].textColor,
        side: THREE.DoubleSide,
      });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      const angle = -Math.PI / 2;
      textMesh.rotateX(angle);

      textMesh.position.y = labelData[i].y;
      textMesh.position.x = labelData[i].x;
      textMesh.position.z = labelData[i].z;

      scene.add(textMesh);
      labelmeshes.push(textMesh);
    }
  });

  gltfLoader.load("models/arrow/direction_arrow.glb", function (gltf) {
    for (let i = 0; i < arrowData.length; i++) {
      const gltfScene = gltf.scene.clone();
      gltfScene.position.x = arrowData[i].x;
      gltfScene.position.y = arrowData[i].y;
      gltfScene.position.z = arrowData[i].z;
      const angle = -(Math.PI * arrowData[i].angle) / 180;
      
      gltfScene.rotateY(angle);
      gltfScene.scale.setScalar(0.05);

      scene.add(gltfScene);
    }
  });

  gltfLoader.load("models/truck/truck.glb", function (gltf) {
    for (let i = 0; i < truckData.length; i++) {
      const gltfScene = gltf.scene.clone();
      gltfScene.position.x = truckData[i].x;
      gltfScene.position.y = truckData[i].y;
      gltfScene.position.z = truckData[i].z;
      const angle = -(Math.PI * truckData[i].angle) / 180;

      gltfScene.rotateY(angle);
      gltfScene.scale.setScalar(0.001);

      scene.add(gltfScene);
    }
  });
}
