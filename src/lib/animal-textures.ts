import * as THREE from "three";

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d")! };
}

/** Zebra: black stripes on bone-white base. */
export function zebraTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#ece4d3";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#141410";
  ctx.lineCap = "round";
  for (let i = -4; i < 20; i++) {
    ctx.lineWidth = 10 + Math.sin(i) * 3;
    ctx.beginPath();
    ctx.moveTo(i * 22 - 40, 0);
    ctx.lineTo(i * 22 - 40 + 60, 256);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

/** Cheetah: warm gold base with dark spots. */
export function cheetahTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#c9a15a";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#241d12";
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 90; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    const r = 3 + rand() * 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Crocodile: olive scute/scale pattern. */
export function crocodileTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#3c4326";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#242c16";
  ctx.lineWidth = 1.5;
  const size = 16;
  for (let y = 0; y < 256; y += size) {
    for (let x = 0; x < 256; x += size) {
      const offset = (y / size) % 2 === 0 ? 0 : size / 2;
      ctx.strokeRect(x + offset, y, size, size);
    }
  }
  ctx.fillStyle = "#4a5430";
  for (let y = 0; y < 256; y += size) {
    for (let x = 0; x < 256; x += size) {
      if ((x + y) % (size * 2) === 0) {
        const offset = (y / size) % 2 === 0 ? 0 : size / 2;
        ctx.fillRect(x + offset + 2, y + 2, size - 4, size - 4);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}
