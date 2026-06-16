# Design

## Overview

Scarniko usa un tema oscuro como identidad de marca, no como preferencia. Paleta terracota/óxido sobre fondos casi-negros con tinte cálido. Tipografía tripartita: Space Grotesk para encabezados y UI principal, Manrope para cuerpo y etiquetas, JetBrains Mono para datos numéricos y badges. Densidad alta, decoración cero, cada elemento justificado.

## Color Palette

Modo oscuro (por defecto y como identidad):

```
--bg:        oklch(0.12 0.010 50)   /* fondo principal: casi negro con tinte terracota */
--bg-2:      oklch(0.10 0.008 50)   /* sidebar / fondo secundario */
--surface:   oklch(0.17 0.012 48)   /* cards, paneles */
--surface-2: oklch(0.21 0.012 48)   /* inputs, elementos elevados dentro de cards */
--elev:      oklch(0.20 0.012 48)   /* menús flotantes, dropdowns */
--border:    oklch(1 0 0 / 0.085)   /* bordes principales */
--border-2:  oklch(1 0 0 / 0.048)   /* bordes sutiles entre elementos */
--text:      oklch(0.95 0.005 65)   /* texto principal */
--dim:       oklch(0.72 0.008 58)   /* texto secundario / metadata */
--faint:     oklch(0.60 0.007 58)   /* labels, placeholders, iconos inactivos */
```

Modo claro (alternativo, usuario puede togglear):
```
--bg:        oklch(0.976 0.004 65)
--text:      oklch(0.18 0.018 55)
--dim:       oklch(0.42 0.012 58)
--faint:     oklch(0.48 0.009 58)
```

Paleta de acento (semántica, earthy, ganada):
```
--teal (primario/terracota): oklch(0.62 0.145 35)   /* rust/terracota — voz principal */
--violet (muted mauve):      oklch(0.58 0.08 300)    /* usado con cuentagotas */
--lime (sage):               oklch(0.70 0.10 155)    /* positivo / subiendo */
--amber (earthy amber):      oklch(0.74 0.12 65)     /* calidez / demanda media */
--pink (clay red):           oklch(0.60 0.12 22)     /* negativo / bajando */
--blue (slate):              oklch(0.60 0.08 250)    /* estado en-stock */
```

El primario terracota (`--teal` semánticamente, rust visualmente) es la voz de la marca. Se usa en el logo, nav activo, botones primarios, bordes de tarjeta activa, y glows. Todo lo demás es neutro.

## Typography

Stack tripartito con roles claros:

| Rol | Familia | Pesos |
|-----|---------|-------|
| Display / encabezados | Space Grotesk | 500, 600, 700 |
| Cuerpo / UI | Manrope | 400, 500, 600, 700, 800 |
| Datos / mono | JetBrains Mono | 400, 500, 700 |

Escala de tamaños:
- Page title (`.pt`): 30px, Space Grotesk 700, letter-spacing -0.6px
- Card heading (`h2`): 16px, Space Grotesk 600, letter-spacing -0.2px
- Body default: 14px, Manrope 500
- Labels / eyebrows: 11-12px, Manrope 700
- Mono / datos: 12-13px, JetBrains Mono 700
- Micro / badges: 10-11px

`text-wrap: balance` en `.pt` (page titles). El mono se aplica a números con `font-variant-numeric: tabular-nums`.

## Spacing & Radius

Escala de radios (contenidos, no exagerados):
```
--r-sm: 6px   /* inputs, botones pequeños, badges */
--r-md: 8px   /* cards secundarias, filas */
--r-lg: 10px  /* cards principales */
--r-xl: 14px  /* login box, modales */
```

Pills y avatares usan `border-radius: 999px`. Nada supera `14px` en cards.

Espaciado de la grilla del scroll: `26px` de padding lateral en desktop, `14px` en mobile. Gap entre cards: `18px`.

## Component Inventory

### Cards
```
.card           — surface + border + r-lg + padding 22px + card-grad sutil
.card.glow      — variante sin el pseudo-before (se usa para el radar)
.card-h         — cabecera con ícono + título + subtítulo
.stat           — tile de métrica: label + num + delta + sparkline
.stat-row       — grid auto-fit minmax(180px,1fr) de stats
```

### Navigation
```
.sidebar        — 248px fijo, colapsa a 76px icónico en <880px, oculto en <640px
.nav-item       — ítem de nav con active state: bg tintada + inset border-left 3px primario
.mob-nav        — bottom nav fijo en <640px con blur/backdrop
.acct-btn       — account switcher en topbar
.acct-menu      — dropdown flotante del switcher
```

### Data Display
```
.kanban         — 3 columnas (En casa / En Vinted / Vendido), colapsa a 1 col en <1080px
.kb-card        — tarjeta de prenda con coste→precio→margen + acciones
.rank-list      — lista de marcas/cuentas con rank badge + sparkline
.rank-item      — fila individual con .top3 highlight
.bar-row        — barra de progreso horizontal con animación scaleX
```

### Calendario V2 — Timing Command Center
```
.cal-hero            — card 3-col: demanda ahora · veredicto · mejor hora hoy
.cal-hero-side       — panel lateral (left = now con track bar, right = peak align-right)
.cal-verdict         — panel central con badge + headline + sub; bordes laterales
.cal-verdict-badge   — pill veredicto: .cv-now (terracota+glow) / .cv-good / .cv-soon / .cv-wait
.cal-curve-wrap      — contenedor del SVG de demanda diaria
.cal-curve-svg       — SVG animado: área gradient + línea catmull-rom + marcador hora + pico
.cal-week            — grid 7 cols, un tile por día de la semana
.cal-day             — tile con nombre + mini barras + hora pico; .today con borde primario
.cal-day-seg         — segmento mini-barra; .hot = bloque con el pico (terracota)
.slot-v2             — fila de franja: rank numérico + info + horario (reemplaza .slot/.st-*)
```

Clases SVG (inline):
```
.cal-axis-line   — líneas de grid horizontales en 25/50/75
.cal-axis-text   — etiquetas hora en eje X (JetBrains Mono)
.cal-area        — área rellena con gradiente vertical (terracota → transparente)
.cal-line        — línea suave catmull-rom sobre el área
.cal-now-vline   — línea punteada vertical en hora actual + label "AHORA"
.cal-peak-dot    — punto terracota sobre el máximo + etiqueta de hora
```

### Forms
```
.form-grid      — auto-fit grid de campos
.fld            — campo con label + input
.stage-toggle   — toggle pill para estado de prenda
.btn-primary    — CTA principal, primario lleno
.kb-btn         — botón de acción compacto en kanban
```

### Feedback
```
.toast          — notificación bottom-center, pill, con undo
.login-overlay  — pantalla completa de auth sobre el fondo de la app
.empty          — estado vacío centrado con ícono SVG
.radar-skeleton — skeleton animado de los anillos del radar mientras carga
```

## Motion

- Entrada de vistas: `viewIn` — `translateY(14px)` → 0, 0.45s `cubic-bezier(0.22,1,0.36,1)`
- Barras de categoría: `scaleX(0)` → 1, 1.1s `cubic-bezier(0.22,1,0.36,1)`
- Ticker del topbar: `ticker` linear infinite 38s
- Skeleton del radar: `rs-pulse` opacity 0.35↔0.65, 1.8s ease-in-out
- Pulse dot (live): `pulse` — glow ring expand, 2s infinite
- Menús / dropdowns: opacity + translateY(-6px) + scale(0.98), 0.18s
- Tema toggle: `background-color/color` 0.45s ease
- **Curva del calendario**: secuencia encadenada:
  - `.cal-now-vline`: `calFadeIn` 0.4s delay 0.1s
  - `.cal-line` (SVG path): `stroke-dashoffset` len→0 vía JS `getTotalLength()`, 1.6s cubic-bezier(0.22,1,0.36,1) delay 0.05s
  - `.cal-area`: `calFadeIn` 0.9s delay 0.6s
  - `.cal-peak-dot` + `.cal-peak-txt`: `calFadeIn` 0.5s delay 1.4s
- **Barra hero ahora**: `width` 0%→score%, 1.2s cubic-bezier(0.22,1,0.36,1), delay 80ms

Todos tienen `@media (prefers-reduced-motion: reduce)` que corta o sustituye con crossfade.

## Layout Architecture

```
html (theme-dark/light)
  .bg-fx              — ambient radial + grid de puntos (fixed, z=0)
  .app                — grid 248px + 1fr (el corazón del layout)
    .sidebar          — flex col, 22px padding
    .main             — flex col, 100vh
      .topbar         — flex row fijo con ticker + search + account switcher
      .scroll         — overflow-y auto, padding 26px
        .view         — display:none / .active display:block
  .mob-nav            — fixed bottom, solo <640px
  .login-overlay      — fixed inset, z=200
  .toast              — fixed bottom-center, z=100
```

Z-index scale implícita: acct-menu(50) → mob-nav(20) → toast(100) → login-overlay(200).

## Responsive Breakpoints

| Breakpoint | Cambio principal |
|-----------|-----------------|
| ≤ 1080px  | Radar 1 col, g-3→1 col, kanban→1 col |
| ≤ 880px   | Sidebar colapsa a iconos (76px), g-2→1 col, search oculto |
| ≤ 640px   | Sidebar desaparece, mob-nav aparece, padding 14px |

## Current State & Known Next Steps

Sesión 2 (jun 2026):
- Creados PRODUCT.md y DESIGN.md (no existían)
- Optimizer rediseñado: resultado full-width, 3 variantes de título, intel de demanda cross-reference con MARKET_BRANDS
- Dashboard: health vitals (sell-through %, parados, días/venta); badges prioridad URGENTE/OPORTUNIDAD/CONSEJO

Sesión anterior (commit e7f4e0b):
- Demand history + sparklines radar ranking
- Mobile responsive completo + bottom nav PWA

Sesión 3 (jun 2026):
- Calendar con blend live/algorítmico en `api/calendar.js` (4 queries paralelas Vinted, blend 70/40/0% según muestras)
- Confirmado: API Vinted `/catalog/items` **no devuelve timestamps** en ningún campo → calendar usa siempre modelo algorítmico

Sesión 4 (jun 2026):
- Hardening seguridad: `api/_lib/tokens.js` (AES-256-GCM Blob), `api/_lib/auth.js` (rate limit), `api/save-tokens.js` (solo refresh_token), cron diario 06:00 UTC
- `@vercel/blob` v2.4.0: blobs privados con `get(pathname, {access:"private"})` y `put()` con `access:"private"`, `allowOverwrite:true`
- `TOKEN_ENCRYPTION_KEY` (64 hex): pendiente de configurar en Vercel env vars

Sesión 5 (16 jun 2026):
- **Calendar V2 — Timing Command Center** (commit 5365e25): rediseño completo de la vista Calendario
  - `app.js`: `renderCalendar()` reescrito + helpers `renderDayCurve()`, `renderWeekStrip()`, `_calCatmullPath()`
  - `index.html`: hero 3-col (`.cal-hero`), contenedor SVG (`.cal-curve-wrap`), strip semanal (`.cal-week`)
  - `styles.css`: eliminados `.heat-*`, `.slot-list`, `.slot`, `.st-*`; añadido todo `.cal-*` y `.slot-v2`
  - Lógica de veredicto en tiempo real: `cv-now` (≥70) / `cv-good` (≥45) / `cv-soon` (<45) / `cv-wait` (fuera horario)
  - SVG catmull-rom animado con secuencia encadenada (now-vline → line draw → area fadeIn → peak dot)
  - Reducción motion: `@media (prefers-reduced-motion: no-preference)` en todos los keyframes; JS check antes del stroke-dashoffset

Pendiente próxima sesión:
- Seguir mejorando el diseño general (usuario confirmó que continuamos mañana)
- Rotar `BLOB_READ_WRITE_TOKEN` en Vercel Dashboard (fue expuesto accidentalmente en sesión anterior)
- Configurar `TOKEN_ENCRYPTION_KEY` en Vercel env vars
- Posible: vista de Analytics / histórico de ventas
- Posible: mejorar la vista de Cuentas con más detalle por cuenta
