# SPEC-2—Tetris×2048 Hybrid (Web Component, JavaScript, 11×11)

## Background

You’re building a hybrid 2D puzzle game inspired by Tetris and 2048 **implemented as a reusable Web Component** (Custom Element) that runs on modern browsers for desktop and mobile. The playfield is an 11×11 grid with a single-piece preview. At game start, a random tetromino is placed at a valid in-board location and another random piece appears in the preview. Clicking/tapping the preview rotates it 90° clockwise. On swipe or arrow/WASD input, **all placed pieces slide (fall) in the chosen direction simultaneously**; any fully filled rows *or* columns clear and score. If a piece becomes disconnected by a clear (no touching sides or corners), each fragment becomes an independent piece. Then the preview piece attempts to spawn using its current rotation — if no valid placement exists, it’s **Game Over**. The component persists high scores and exposes a New Game control. No advertisements.

## Requirements

**MoSCoW**

**Must Have**

* **Web-only**: vanilla JavaScript Web Component (no framework dependency required; optional build-free ES modules).
* 11×11 grid playfield; responsive scaling for phone/tablet/desktop.
* Start-of-game: place a random tetromino at a random valid location; generate another in **Preview**.
* Preview rotates 90° per click/tap; no auto-rotation during spawn.
* Inputs: swipe (touch/pointer) or arrow/WASD/d-pad ⇒ apply gravity to all pieces in that direction.
* Clear fully filled **rows and columns** after movement; score the clear(s) and **then** handle splits (8-connectivity: sides or corners).
* After resolve, **spawn the Preview piece** using its **current rotation only** into a random valid position; if none exists ⇒ **Game Over**. Generate next preview.
* Persist **High Score** and **Daily Map** (one attempt per day, keep best) using localStorage; New Game button.
* **Undo (1 move)** available without ads (single snapshot depth).
* Minimal, flat visuals; color-blind–friendly palette; subtle animations; haptic feedback on supported devices (via Vibration API, toggleable).

**Should Have**

* **Theme system** via CSS custom properties and sprite/palette packs; runtime theme switching.
* Accessibility: high-contrast theme; keyboard-only play; reduced motion setting.
* Configurable board size; presets: Classic 11×11, Triomino Mode 9×9 (optional 7×7).

**Could Have**

* Shareable daily seed code; lightweight analytics (opt-in) stored locally.
* Tutorial overlay; sound effects with WebAudio (mute persists).

**Won’t Have (v1)**

* Numbered/merging tiles.
* Ads, IAP, or external SDKs.
* Online services or leaderboards.

**Scoring (v1)**

* +100 per full **row**; +100 per full **column** cleared in the same move.
* Combo bonus: +50 × (n−1) for additional lines/columns in same move.
* Perfect Clear bonus: +500 if board empty after resolution.

**Performance & UX Targets**

* 60 FPS on mid-range mobile; ≤2 ms simulation per move on 11×11.
* Pointer targets ≥48 px; safe areas respected; works offline (optional).

**Persistence**

* localStorage keys for settings/high scores/daily best + last-played date; optional IndexedDB if storing replays later.

## Method

### Architecture Overview

* **Custom Element**: `<tetro-2048-board>` with **Shadow DOM** encapsulation.
* **Rendering**: `<canvas>` for board + preview; device-pixel–scaled; crisp pixel snapping.
* **Input Layer**: Pointer events for swipe (distance & direction threshold), keyboard for arrows/WASD, focus management for accessibility.
* **State**: Pure JS model (immutable-ish updates per move) with serialization for Undo and persistence.
* **Theming**: CSS custom properties on host; optional `theme="minimal|high-contrast|..."` attribute.

### Public API (attributes & events)

* Attributes: `width`, `height` (grid dims, default 11×11), `mode="classic|daily|triomino"`, `triomino-size="9|7"`, `theme`.
* Methods: `newGame()`, `undo()`, `setTheme(name)`.
* Events: `score`, `gameover`, `cleared`, `spawn`, `undo`.

### Data Model (JSDoc-typed JavaScript)

```js
/** @typedef {{x:number,y:number}} Vec2 */
/** @typedef {{id:number, kind:string, rotation:0|90|180|270, anchor:Vec2, cells:Vec2[]}} Piece */
/** @typedef {{w:number,h:number, occ:Int32Array, pieces:Map<number,Piece>, preview:Piece, score:number, rng:number}} GameState */
```

* **Occupancy**: Int32Array length `w*h`, value = `pieceId` or `-1` for empty.
* **Connectivity**: 8-neighbor flood fill on world-cell coordinates per piece to split fragments.
* **RNG & Daily**: Seed derived from `YYYYMMDD` in America/New_York for Daily mode; PRNG e.g., xorshift32.

### Core Pipeline per Move

1. Read input direction `d`.
2. For each piece, compute **max slide** along `d` without collisions/bounds.
3. Apply all moves simultaneously.
4. Detect & clear fully filled rows/columns; accumulate score & combo.
5. Split any disconnected pieces (8-neighbors).
6. **Settle pass**: one extra slide along `d` (post-clear openings).
7. Try spawning Preview (current rotation only) at a random valid position; if no fit ⇒ Game Over; else generate next preview.
8. Save snapshot for Undo; persist high score & daily best.

### Key Algorithms (vanilla JS)

**Slide distance**

```js
function slideDistance(piece, dir, occ, w, h){
  let dist = 0;
  outer: for(;;){
    dist++;
    for(const c of piece.cells){
      const nx = piece.anchor.x + c.x + dir.x*dist;
      const ny = piece.anchor.y + c.y + dir.y*dist;
      if(nx<0||ny<0||nx>=w||ny>=h) { dist--; break outer; }
      const pid = occ[ny*w + nx];
      if(pid !== -1 && pid !== piece.id){ dist--; break outer; }
    }
  }
  return dist;
}
```

**Apply swipe**

```js
function applySwipe(state, dir){
  const order = sortPiecesForDir(state.pieces, dir);
  const deltas = new Map();
  for(const p of order) deltas.set(p.id, slideDistance(p, dir, state.occ, state.w, state.h));
  for(const p of order) movePiece(state, p, mul(dir, deltas.get(p.id)));
  const cleared = clearFullLines(state);
  if(cleared.rows.length || cleared.cols.length){
    splitDisconnected(state); // 8-neighbor
    settlePass(state, dir);
    const combo = cleared.rows.length + cleared.cols.length;
    state.score += 100*combo + 50*Math.max(0, combo-1);
    if(isBoardEmpty(state)) state.score += 500;
  }
  if(!spawnFromPreview(state)) state.gameOver = true; else snapshot(state);
}
```

**Split via 8-neighbor connectivity**

```js
function components8(cells){
  const set = new Set(cells.map(v=>v.x+","+v.y));
  const seen = new Set();
  const res=[];
  for(const key of set){
    if(seen.has(key)) continue;
    const [sx,sy] = key.split(",").map(Number);
    const stack=[[sx,sy]]; seen.add(key); const comp=[];
    while(stack.length){
      const [x,y]=stack.pop(); comp.push({x,y});
      for(let dx=-1; dx<=1; dx++) for(let dy=-1; dy<=1; dy++){
        if(dx===0 && dy===0) continue;
        const nk=(x+dx)+","+(y+dy);
        if(set.has(nk) && !seen.has(nk)){ seen.add(nk); stack.push([x+dx,y+dy]); }
      }
    }
    res.push(comp);
  }
  return res;
}
```

### Web Component Skeleton

```js
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host{ display:block; touch-action: none; }
    canvas{ width:100%; height:auto; image-rendering: pixelated; }
    .hud{ position:absolute; inset:0; pointer-events:none; }
  </style>
  <canvas part="board"></canvas>
  <div class="hud" part="hud"></div>
`;

class Tetro2048Board extends HTMLElement{
  /** @type {HTMLCanvasElement} */ _canvas;
  /** @type {CanvasRenderingContext2D} */ _ctx;
  /** @type {GameState} */ _state;
  /** @type {{x:number,y:number}|null} */ _dragStart = null;
  constructor(){
    super();
    const shadow = this.attachShadow({mode:'open'});
    shadow.append(tpl.content.cloneNode(true));
    this._canvas = shadow.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
  }
  connectedCallback(){ this._init(); this._bind(); this.newGame(); }
  disconnectedCallback(){ this._unbind(); }
  static get observedAttributes(){ return ['width','height','mode','theme']; }
  attributeChangedCallback(){ /* reconfigure if needed */ }
  newGame(){ /* init state, place first piece, set preview, draw */ }
  undo(){ /* restore last snapshot if exists */ }
  _init(){ /* setup DPR scaling, themes */ }
  _bind(){
    this._canvas.addEventListener('pointerdown', e=>{ this._dragStart={x:e.clientX,y:e.clientY}; });
    this._canvas.addEventListener('pointerup', e=>{
      if(!this._dragStart) return;
      const dx=e.clientX-this._dragStart.x, dy=e.clientY-this._dragStart.y;
      const adx=Math.abs(dx), ady=Math.abs(dy);
      let dir = null;
      if(Math.max(adx,ady) > 24){
        dir = adx>ady ? {x:Math.sign(dx), y:0} : {x:0, y:Math.sign(dy)};
      }
      this._dragStart=null;
      if(dir) { applySwipe(this._state, dir); this._draw(); if(this._state.gameOver) this.dispatchEvent(new Event('gameover')); }
    });
    this.addEventListener('keydown', e=>{
      const m = {ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},
                 a:{x:-1,y:0},d:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1}};
      const dir = m[e.key]; if(dir){ e.preventDefault(); applySwipe(this._state, dir); this._draw(); }
    });
  }
  _unbind(){ /* remove listeners */ }
  _draw(){ /* clear canvas, draw grid, pieces, preview */ }
}
customElements.define('tetro-2048-board', Tetro2048Board);
```

### Theming (CSS Custom Properties)

Expose properties on `:host` and honor them in drawing logic or use an offscreen CSS→palette map:

```css
:tetro-2048-board{
  --board-bg: #111418;
  --grid-stroke: #2a2f36;
  --piece-I: #74B9FF; --piece-O:#FDCB6E; --piece-T:#A29BFE; --piece-S:#55EFC4;
  --piece-Z:#FF7675; --piece-J:#74E3FF; --piece-L:#FAB1A0;
}
```

### Persistence (localStorage)

* Keys

  * `tetro2048.highscore` = number
  * `tetro2048.settings` = JSON { mute:boolean, contrast:string, haptics:boolean, theme:string }
  * `tetro2048.daily.<YYYY-MM-DD>` = { best:number, played:boolean }
  * `tetro2048.snapshot` = last undo state (cleared after use)

### Daily Mode

* Compute local date in **America/New_York** (Intl API) and derive seed; lock to one attempt/day by storing `played=true` after first game end or first move.

### Haptics (optional)

* Use `navigator.vibrate([12])` on drop/clear/gameover with user toggle.

## Implementation

### Steps

1. **Scaffold** the Custom Element (no-build ES modules) with Canvas rendering.
2. Implement model: pieces, occupancy, movement, clear, split, spawn, scoring; unit-test logic in pure JS.
3. Hook input (pointer + keyboard), add Undo snapshotting (single-depth), and persistence (localStorage).
4. Implement Daily mode (seed + one attempt/day + best persist).
5. Add Theme system via CSS variables + runtime palette; draw crisp grid & pieces; preview rotate on click/tap.
6. Add animations (ease-out translate on slide; flash on clears) using requestAnimationFrame.
7. Polish accessibility (focus ring, reduced motion, high contrast), and mobile haptics toggle.

### Deliverables

* `tetro-2048-board.js` (custom element), `pieces.js` (shape data), `model.js` (logic), `theme.css` (defaults), `index.html` demo.

### Example HTML Usage

```html
<link rel="stylesheet" href="theme.css">
<tetro-2048-board mode="classic" width="11" height="11" theme="minimal"></tetro-2048-board>
<script type="module" src="tetro-2048-board.js"></script>
```

## Milestones

1. **M0 — Core Logic**: model + tests (slide/clear/split/spawn/scoring).
2. **M1 — Web Component**: canvas draw, input, preview rotation.
3. **M2 — Persistence & Daily**: localStorage keys; one-attempt/day; high score.
4. **M3 — Themes & Polish**: CSS vars, animations, accessibility, haptics.
5. **M4 — Triomino Mode**: alt shapes; 9×9 default (7×7 option); balance.
6. **M5 — Packaging**: minified build (optional), README, demo page.

## Gathering Results

* Track (locally) average clears per move, median game length, perfect clears, undo usage.
* Playtest difficulty by adjusting spawn randomness and combo values.
* Performance budget checks: frame time <16 ms, simulation <2 ms.

## Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
