import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type ShoeScene = { rotate: (delta: number) => void; reset: () => void; variant: (index: number) => void; setPaused: (paused: boolean) => void; dispose: () => void };

/** Loaded only inside the sneaker studio. The scene owns and releases every GPU resource. */
export async function createShoeScene(host: HTMLDivElement, signal: AbortSignal, ready: () => void, failed: () => void): Promise<ShoeScene> {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia("(pointer:coarse)").matches ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
  camera.position.set(3.6, 1.9, 5.1); camera.lookAt(0, .1, 0);
  const environment = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .04);
  scene.environment = environmentTarget.texture;
  environment.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x71845b, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xd9ff8e, 2); rim.position.set(3, 2, -3); scene.add(rim);
  const pivot = new THREE.Group(); scene.add(pivot);
  const materials = new Set<THREE.Material>(), geometries = new Set<THREE.BufferGeometry>();
  const textures = new Set<THREE.Texture>();
  let disposed = false, paused = false, raf = 0, visible = true, yaw = -.32, pitch = -.08, idle = 0, lastTime = 0;
  let shoe: THREE.Object3D | undefined, variants: THREE.Material[] = [];
  const motion = matchMedia("(prefers-reduced-motion: reduce)"), pointer = matchMedia("(pointer:fine)");
  const animated = () => !paused && !motion.matches && pointer.matches;
  function collect(root: THREE.Object3D) { root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); } }); }
  function disposeModelResources() {
    for (const material of materials) { for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value); material.dispose(); }
    for (const texture of textures) { const data = texture.source.data; if (typeof ImageBitmap !== "undefined" && data instanceof ImageBitmap) data.close(); texture.dispose(); }
    for (const geometry of geometries) geometry.dispose();
  }
  function draw(time = 0) {
    raf = 0;
    if (disposed || document.hidden || !visible || !shoe) return;
    if (animated()) { const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0; idle += delta; }
    lastTime = time;
    pivot.rotation.set(pitch, yaw + (animated() ? Math.sin(idle * .45) * .07 : 0), -.12);
    pivot.position.y = animated() ? Math.sin(idle * .8) * .045 : 0;
    renderer.render(scene, camera);
    host.dataset.rotation = yaw.toFixed(2);
    host.dataset.motion = animated() ? "gentle" : "still";
    if (animated()) raf = requestAnimationFrame(draw);
  }
  function render() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
  function stop() { cancelAnimationFrame(raf); raf = 0; lastTime = 0; }
  const resize = new ResizeObserver(() => { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); render(); }); resize.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) render(); else stop(); }); observer.observe(host);
  const visibility = () => { if (document.hidden) stop(); else render(); };
  const preference = () => { stop(); render(); };
  document.addEventListener("visibilitychange", visibility); motion.addEventListener("change", preference); pointer.addEventListener("change", preference);
  const lost = (event: Event) => { event.preventDefault(); failed(); dispose(); }; canvas.addEventListener("webglcontextlost", lost);
  let drag: { id: number; x: number; y: number; yaw: number; pitch: number; horizontal: boolean } | undefined;
  const down = (event: PointerEvent) => { if (event.button !== 0) return; drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch, horizontal: false }; };
  const move = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.horizontal) { if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag = undefined; return; } if (Math.abs(dx) < 8) return; drag.horizontal = true; canvas.setPointerCapture(event.pointerId); }
    yaw = drag.yaw + dx * .009; pitch = Math.max(-.5, Math.min(.45, drag.pitch + dy * .003)); render();
  };
  const up = (event: PointerEvent) => { if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); drag = undefined; };
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  function dispose() {
    if (disposed) return; disposed = true; stop(); resize.disconnect(); observer.disconnect();
    document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", preference); pointer.removeEventListener("change", preference);
    canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
    signal.removeEventListener("abort", dispose);
    disposeModelResources(); environmentTarget.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  }
  signal.addEventListener("abort", dispose, { once: true });
  try {
    const response = await fetch("/assets/sneakers-studio/shoe.glb", { signal });
    if (!response.ok) throw Error("Shoe model unavailable");
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
    collect(gltf.scene);
    variants = await Promise.all([0, 1, 2].map(index => gltf.parser.getDependency("material", index))) as THREE.Material[];
    variants.forEach(material => materials.add(material));
    if (disposed || signal.aborted) { disposeModelResources(); throw new DOMException("Aborted", "AbortError"); }
    shoe = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(shoe), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = 4.45 / Math.max(size.x, size.y, size.z);
    shoe.position.copy(center.multiplyScalar(-scale)); shoe.scale.setScalar(scale); pivot.add(shoe);
    render(); ready();
  } catch (error) { dispose(); throw error; }
  return { rotate(delta) { yaw += delta; render(); }, reset() { yaw = -.32; pitch = -.08; render(); }, variant(index) { const material = variants[index]; if (!material || !shoe) return; shoe.traverse(object => { if (object instanceof THREE.Mesh) object.material = material; }); host.dataset.variant = String(index); render(); }, setPaused(value) { paused = value; stop(); render(); }, dispose };
}
