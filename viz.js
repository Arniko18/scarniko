/* ============================================================
   SCARNIKO · VISUALS
   Radar (canvas) · sparklines · gauges · count-up
   ============================================================ */

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ---------- COUNT-UP ---------- */
function countUp(el, to, { dur = 1100, prefix = "", suffix = "", decimals = 0 } = {}) {
  const fmtV = v => prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + suffix;
  el.textContent = fmtV(to); // siempre deja el valor final como base
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.hidden || reduce) return; // sin animación si está oculto: el final ya está puesto
  const start = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - start) / dur);
    if (p >= 1) { el.textContent = fmtV(to); return; }
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtV(to * e);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- SPARKLINE (svg path) ---------- */
function sparkline(data, { w = 160, h = 38, color = "var(--primary)", fill = true } = {}) {
  if (!data.length) data = [0, 0];
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1 || 1);
  const pts = data.map((d, i) => [i * step, h - 4 - ((d - min) / span) * (h - 8)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  const id = "sg" + Math.random().toString(36).slice(2, 7);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${fill ? `<path d="${area}" fill="url(#${id})"/>` : ""}
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/* random-ish but stable trend series from a seed */
function seriesFromSeed(seed, n = 12, base = 50, vol = 18) {
  const out = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    const r = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    v += (r - Math.floor(r) - 0.45) * vol;
    v = Math.max(5, v);
    out.push(v);
  }
  return out;
}

/* ---------- GAUGE RING (svg) ---------- */
function gaugeRing(pct, { size = 96, stroke = 9, color = "var(--primary)" } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return `<svg viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"
      transform="rotate(-90 ${size/2} ${size/2})" style="transition:stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)"
      data-target="${off}"/>
  </svg>`;
}
function animateGauges(root = document) {
  root.querySelectorAll("svg circle[data-target]").forEach(c => {
    requestAnimationFrame(() => { c.style.strokeDashoffset = c.dataset.target; });
  });
}

/* ============================================================
   RADAR — animated canvas
   ============================================================ */
const Radar = (function () {
  let canvas, ctx, raf, brands = [], blips = [], sweep = 0, dpr = 1, size = 0;
  let colors = {};
  let hoverIdx = -1;

  function readColors() {
    colors = {
      ring: cssVar("--border") || "rgba(255,255,255,0.09)",
      ringStrong: cssVar("--faint"),
      sweep: cssVar("--teal"),
      text: cssVar("--dim"),
      faint: cssVar("--faint"),
      hot: cssVar("--pink"),
      rising: cssVar("--lime"),
      warm: cssVar("--amber"),
      cool: cssVar("--faint"),
      bg: cssVar("--surface")
    };
  }
  function heatColor(h) {
    return h === "hot" ? colors.hot : h === "rising" ? colors.rising : h === "warm" ? colors.warm : colors.cool;
  }

  function layout() {
    const sectorCount = SECTORS.length;
    const counts = {};
    blips = brands.map((b, i) => {
      const si = SECTORS.findIndex(s => s.key === b.sector);
      counts[si] = (counts[si] || 0) + 1;
      // spread brands inside their sector wedge
      const within = counts[si];
      const baseA = (si / sectorCount) * Math.PI * 2 - Math.PI / 2;
      const jitter = ((within % 3) - 1) * 0.16 + (Math.sin(i * 9.7) * 0.05);
      const a = baseA + jitter + (Math.PI / sectorCount) * 0.0;
      // demand -> radius (higher demand closer to center)
      const t = Math.max(0, Math.min(1, (b.demand - 42) / 58));
      const rNorm = 0.9 - t * 0.66;
      return { ...b, a, rNorm, idx: i, phase: Math.random() * Math.PI * 2 };
    });
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    size = Math.min(rect.width, rect.height) || 420;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(now) {
    if (!ctx) return;
    const cx = size / 2, cy = size / 2;
    const R = size * 0.42;
    ctx.clearRect(0, 0, size, size);

    // rings
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
      ctx.strokeStyle = colors.ring;
      ctx.stroke();
    }
    // sector spokes + labels
    ctx.font = `600 ${Math.max(9, size * 0.023)}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "middle";
    const pad = size * 0.012;
    for (let i = 0; i < SECTORS.length; i++) {
      const a = (i / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = colors.ring;
      ctx.stroke();
      // label at wedge center, anchored to the side so it never clips
      const la = a + (Math.PI / SECTORS.length);
      const cosL = Math.cos(la), sinL = Math.sin(la);
      let lx = cx + cosL * (R + size * 0.04);
      let ly = cy + sinL * (R + size * 0.04);
      if (cosL > 0.2) { ctx.textAlign = "right"; lx = size - pad; }
      else if (cosL < -0.2) { ctx.textAlign = "left"; lx = pad; }
      else { ctx.textAlign = "center"; }
      ly = Math.max(size * 0.03, Math.min(size - size * 0.03, ly));
      ctx.fillStyle = colors.faint;
      ctx.fillText(SECTORS[i].label, lx, ly);
    }

    // sweep
    sweep += 0.012;
    const sweepA = sweep % (Math.PI * 2);
    const grad = ctx.createConicGradient ? ctx.createConicGradient(sweepA, cx, cy) : null;
    if (grad) {
      const sc = colors.sweep;
      grad.addColorStop(0, sc.replace(")", " / 0.32)").replace("oklch(", "oklch("));
      grad.addColorStop(0.06, "transparent");
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = grad;
      try { ctx.fill(); } catch (e) {}
    }
    // sweep line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepA) * R, cy + Math.sin(sweepA) * R);
    ctx.strokeStyle = colors.sweep;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // center pip
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.sweep;
    ctx.fill();

    // blips
    blips.forEach((b) => {
      const x = cx + Math.cos(b.a) * R * b.rNorm;
      const y = cy + Math.sin(b.a) * R * b.rNorm;
      // angular distance from sweep (for ping)
      let diff = ((b.a - sweepA) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const ping = Math.max(0, 1 - diff / 0.9); // bright right after sweep passes
      const col = heatColor(b.heat);
      const baseR = size * 0.012 + (b.demand / 100) * size * 0.012;
      const hovered = hoverIdx === b.idx;

      // glow halo
      const halo = baseR + ping * size * 0.05 + (hovered ? size * 0.04 : 0);
      const g = ctx.createRadialGradient(x, y, 0, x, y, halo);
      g.addColorStop(0, col.replace("oklch(", "oklch(").length ? withAlpha(col, 0.5 * (0.4 + ping * 0.6)) : col);
      g.addColorStop(1, withAlpha(col, 0));
      ctx.beginPath(); ctx.arc(x, y, halo, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(x, y, baseR, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = withAlpha(colors.bg, 0.9);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // label for strong/pinged/hovered
      if (b.demand >= 82 || ping > 0.25 || hovered) {
        ctx.font = `700 ${Math.max(9, size * 0.024)}px "Space Grotesk", sans-serif`;
        ctx.fillStyle = hovered ? colors.text : withAlpha(colors.text, 0.55 + ping * 0.45);
        ctx.textAlign = "left";
        ctx.fillText(b.name, x + baseR + 4, y);
      }
      b._x = x; b._y = y; b._r = halo;
    });

    raf = requestAnimationFrame(draw);
  }

  function withAlpha(color, a) {
    // works for oklch(...) and rgb-ish; append alpha via color-mix fallback
    if (!color) return `rgba(0,0,0,${a})`;
    if (color.startsWith("oklch")) {
      return color.replace(/\)\s*$/, ` / ${a})`);
    }
    if (color.startsWith("#")) {
      const n = parseInt(color.slice(1), 16);
      return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
    }
    return color;
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    hoverIdx = -1;
    let best = 1e9;
    blips.forEach(b => {
      if (b._x == null) return;
      const d = Math.hypot(b._x - mx, b._y - my);
      if (d < 16 && d < best) { best = d; hoverIdx = b.idx; }
    });
    canvas.style.cursor = hoverIdx >= 0 ? "pointer" : "default";
  }

  return {
    init(canvasEl, brandData) {
      canvas = canvasEl;
      ctx = canvas.getContext("2d");
      brands = brandData;
      readColors();
      layout();
      resize();
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", () => { hoverIdx = -1; });
      if (raf) cancelAnimationFrame(raf);
      draw(); // primer frame síncrono → nunca queda en blanco aunque RAF esté pausado
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) { if (raf) cancelAnimationFrame(raf); draw(); }
      });
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => resize());
        ro.observe(canvas.parentElement);
      }
      window.addEventListener("resize", () => { resize(); });
    },
    refreshColors() { readColors(); },
    update(brandData) { brands = brandData; layout(); },
    stop() { if (raf) cancelAnimationFrame(raf); }
  };
})();
