/**
 * Tetro-2048-Board Web Component
 * Custom element for Tetris×2048 hybrid game
 */

import {
  initGameState,
  applySwipe,
  rotatePreview,
  serializeState,
  deserializeState
} from './model.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      touch-action: none;
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .container {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .board-container {
      position: relative;
      width: 100%;
      background: var(--board-bg, #111418);
      border-radius: 4px;
      overflow: hidden;
    }
    
    canvas {
      display: block;
      width: 100%;
      height: auto;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    
    canvas[part="board"] {
      /* Hide canvas from screen readers, content is announced via aria-live */
    }
    
    .preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--preview-bg, #1a1d24);
      border: 2px solid var(--preview-border, #3a3f48);
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      min-height: 80px;
    }
    
    .preview-label {
      color: var(--hud-text-muted, #8EAAC9);
      font-family: system-ui, sans-serif;
      font-size: 0.875rem;
    }
    
    .preview-canvas {
      width: 96px;
      height: 96px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    
    .hud {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      right: 0.5rem;
      pointer-events: none;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      z-index: 10;
    }
    
    .score {
      background: rgba(0, 0, 0, 0.7);
      color: var(--hud-text, #F1EDE5);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-family: system-ui, monospace;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: var(--hud-text, #F1EDE5);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      font-family: system-ui, sans-serif;
      z-index: 20;
      pointer-events: auto;
    }
    
    .game-over h2 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }
    
    :host([tabindex]) {
      outline: none;
    }
    
    :host([tabindex]:focus-visible) {
      outline: 2px solid var(--hud-text, #F1EDE5);
      outline-offset: 2px;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .preview-container:focus-visible {
      outline: 2px solid var(--hud-text, #F1EDE5);
      outline-offset: 2px;
    }
  </style>
  <div class="container">
    <div class="board-container">
      <canvas part="board"></canvas>
      <div class="hud" part="hud">
        <div class="score" part="score">
          <div>Score: <span id="score-value">0</span></div>
          <div style="font-size: 0.75rem; opacity: 0.8;">High: <span id="high-score-value">0</span></div>
        </div>
      </div>
      <div class="game-over" id="game-over" style="display: none;" part="game-over" role="dialog" aria-labelledby="game-over-title" aria-live="polite">
        <h2 id="game-over-title">Game Over</h2>
        <p>Final Score: <span id="final-score">0</span></p>
      </div>
    </div>
    <div class="preview-container" part="preview" id="preview-container" role="button" tabindex="0" aria-label="Preview piece. Click or press Enter to rotate 90 degrees clockwise.">
      <span class="preview-label">Preview (click to rotate)</span>
      <canvas class="preview-canvas" part="preview-canvas" id="preview-canvas" aria-hidden="true"></canvas>
    </div>
    <div id="aria-live" aria-live="polite" aria-atomic="true" class="sr-only"></div>
  </div>
`;

class Tetro2048Board extends HTMLElement {
  /** @type {HTMLCanvasElement} */
  _canvas;
  
  /** @type {HTMLCanvasElement} */
  _previewCanvas;
  
  /** @type {CanvasRenderingContext2D} */
  _ctx;
  
  /** @type {CanvasRenderingContext2D} */
  _previewCtx;
  
  /** @type {import('./model.js').GameState} */
  _state;
  
  /** @type {{x:number,y:number}|null} */
  _dragStart = null;
  
  /** @type {number} */
  _cellSize = 32;
  
  /** @type {number} */
  _dpr = 1;
  
  /** @type {string|null} */
  _snapshot = null;
  
  /** @type {boolean} */
  _hapticsEnabled = false;
  
  /** @type {number} */
  _highScore = 0;
  
  /** @type {Map<string, {startTime: number, color: string}>} */
  _clearingAnimations = new Map(); // Key: "x,y", value: animation data
  
  /** @type {number|null} */
  _animationFrameId = null;
  
  /** @type {boolean} */
  _reducedMotion = false;
  
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    
    this._canvas = shadow.querySelector('canvas[part="board"]');
    this._previewCanvas = shadow.querySelector('#preview-canvas');
    this._ctx = this._canvas.getContext('2d');
    this._previewCtx = this._previewCanvas.getContext('2d');
    
    // Load settings
    this._loadSettings();
    this._loadHighScore();
  }
  
  static get observedAttributes() {
    return ['width', 'height', 'mode', 'theme'];
  }
  
  connectedCallback() {
    this._init();
    this._bind();
    this.newGame();
    this.setAttribute('tabindex', '0');
  }
  
  disconnectedCallback() {
    this._unbind();
    // Cancel any ongoing animations
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    if (name === 'width' || name === 'height') {
      this._resize();
    } else if (name === 'theme') {
      this._updateTheme();
    }
  }
  
  /**
   * Start a new game
   */
  newGame() {
    const w = parseInt(this.getAttribute('width') || '11', 10);
    const h = parseInt(this.getAttribute('height') || '11', 10);
    const mode = this.getAttribute('mode') || 'classic';
    
    let seed = null;
    if (mode === 'daily') {
      seed = this._getDailySeed();
    }
    
    this._state = initGameState(w, h, seed);
    this._snapshot = null;
    this._updateScore();
    this._draw();
    this._hideGameOver();
    
    this._announce('New game started. Use arrow keys or WASD to move pieces.');
    
    this.dispatchEvent(new CustomEvent('spawn', { detail: { piece: this._state.preview } }));
  }
  
  /**
   * Undo last move
   */
  undo() {
    if (!this._snapshot || this._state.gameOver) {
      this._announce('Cannot undo. No previous move available.');
      return;
    }
    
    this._state = deserializeState(this._snapshot);
    this._snapshot = null;
    this._updateScore();
    this._draw();
    this._hideGameOver();
    
    this._announce(`Undone. Score: ${this._state.score}`);
    
    this.dispatchEvent(new CustomEvent('undo'));
  }
  
  /**
   * Set theme
   * @param {string} themeName - Theme name
   */
  setTheme(themeName) {
    this.setAttribute('theme', themeName);
    this._saveSettings();
  }
  
  /**
   * Set haptics enabled
   * @param {boolean} enabled - Whether haptics are enabled
   */
  setHaptics(enabled) {
    this._hapticsEnabled = enabled === true;
    this._saveSettings();
  }
  
  _init() {
    this._dpr = window.devicePixelRatio || 1;
    this._resize();
    this._updateTheme();
    
    // Check for reduced motion preference
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  _resize() {
    const w = parseInt(this.getAttribute('width') || '11', 10);
    const h = parseInt(this.getAttribute('height') || '11', 10);
    
    const container = this.shadowRoot.querySelector('.board-container');
    const rect = container.getBoundingClientRect();
    const availableWidth = rect.width;
    
    // Calculate cell size to fit
    this._cellSize = Math.floor(availableWidth / w);
    
    // Set canvas size with DPR scaling
    const displayWidth = this._cellSize * w;
    const displayHeight = this._cellSize * h;
    
    this._canvas.width = displayWidth * this._dpr;
    this._canvas.height = displayHeight * this._dpr;
    this._canvas.style.width = `${displayWidth}px`;
    this._canvas.style.height = `${displayHeight}px`;
    
    // Scale context
    this._ctx.scale(this._dpr, this._dpr);
    
    // Preview canvas - 6x6 grid (slightly bigger than 5x5)
    const previewSize = 96;
    this._previewCanvas.width = previewSize * this._dpr;
    this._previewCanvas.height = previewSize * this._dpr;
    this._previewCanvas.style.width = `${previewSize}px`;
    this._previewCanvas.style.height = `${previewSize}px`;
    this._previewCtx.scale(this._dpr, this._dpr);
  }
  
  _updateTheme() {
    const theme = this.getAttribute('theme') || 'minimal';
    // Theme is applied via CSS custom properties
  }
  
  _bind() {
    // Pointer events for swipe
    this._canvas.addEventListener('pointerdown', this._onPointerDown.bind(this));
    this._canvas.addEventListener('pointerup', this._onPointerUp.bind(this));
    this._canvas.addEventListener('pointercancel', this._onPointerCancel.bind(this));
    
    // Keyboard events
    this.addEventListener('keydown', this._onKeyDown.bind(this));
    
    // Preview rotation
    const previewContainer = this.shadowRoot.querySelector('#preview-container');
    previewContainer.addEventListener('click', this._onPreviewClick.bind(this));
    previewContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._onPreviewClick(e);
      }
    });
    
    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      this._resize();
      this._draw();
    });
    resizeObserver.observe(this.shadowRoot.querySelector('.board-container'));
  }
  
  _unbind() {
    // Event listeners are automatically cleaned up when element is removed
  }
  
  _onPointerDown(e) {
    this._dragStart = { x: e.clientX, y: e.clientY };
    this._canvas.setPointerCapture(e.pointerId);
  }
  
  _onPointerUp(e) {
    if (!this._dragStart) return;
    
    const dx = e.clientX - this._dragStart.x;
    const dy = e.clientY - this._dragStart.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    
    let dir = null;
    const threshold = 24;
    
    if (Math.max(adx, ady) > threshold) {
      if (adx > ady) {
        dir = { x: Math.sign(dx), y: 0 };
      } else {
        dir = { x: 0, y: Math.sign(dy) };
      }
    }
    
    this._dragStart = null;
    
    if (dir) {
      this._makeMove(dir);
    }
  }
  
  _onPointerCancel(e) {
    this._dragStart = null;
  }
  
  _onKeyDown(e) {
    const keyMap = {
      'ArrowLeft': { x: -1, y: 0 },
      'ArrowRight': { x: 1, y: 0 },
      'ArrowUp': { x: 0, y: -1 },
      'ArrowDown': { x: 0, y: 1 },
      'a': { x: -1, y: 0 },
      'd': { x: 1, y: 0 },
      'w': { x: 0, y: -1 },
      's': { x: 0, y: 1 }
    };
    
    const dir = keyMap[e.key];
    if (dir) {
      e.preventDefault();
      this._makeMove(dir);
    }
  }
  
  _onPreviewClick(e) {
    if (this._state.gameOver) return;
    
    rotatePreview(this._state);
    this._drawPreview();
    this._vibrate(12);
    this._announce(`Preview piece rotated. Next piece: ${this._state.preview.kind}`);
  }
  
  _makeMove(dir) {
    if (this._state.gameOver) return;
    
    // Save snapshot for undo
    this._snapshot = serializeState(this._state);
    
    // Get piece colors and positions before clearing
    const cellsBeforeClear = new Map(); // Key: "x,y", value: color
    const pieceColors = {
      'I': getComputedStyle(this).getPropertyValue('--piece-I') || '#74B9FF',
      'O': getComputedStyle(this).getPropertyValue('--piece-O') || '#FDCB6E',
      'T': getComputedStyle(this).getPropertyValue('--piece-T') || '#A29BFE',
      'S': getComputedStyle(this).getPropertyValue('--piece-S') || '#55EFC4',
      'Z': getComputedStyle(this).getPropertyValue('--piece-Z') || '#FF7675',
      'J': getComputedStyle(this).getPropertyValue('--piece-J') || '#74E3FF',
      'L': getComputedStyle(this).getPropertyValue('--piece-L') || '#FAB1A0'
    };
    
    for (const piece of this._state.pieces.values()) {
      const color = pieceColors[piece.kind] || '#FFFFFF';
      for (const cell of piece.cells) {
        const x = piece.anchor.x + cell.x;
        const y = piece.anchor.y + cell.y;
        cellsBeforeClear.set(`${x},${y}`, color);
      }
    }
    
    const result = applySwipe(this._state, dir);
    
    // If lines were cleared, start animation
    if (result.cleared.rows.length || result.cleared.cols.length) {
      this._startClearingAnimation(result.cleared, cellsBeforeClear);
    } else {
      this._updateScore();
      this._draw();
    }
    
    // Announce move to screen readers
    const directionNames = {
      'x:-1,y:0': 'left',
      'x:1,y:0': 'right',
      'x:0,y:-1': 'up',
      'x:0,y:1': 'down'
    };
    const dirKey = `x:${dir.x},y:${dir.y}`;
    const dirName = directionNames[dirKey] || 'unknown';
    
    let announcement = `Moved ${dirName}. Score: ${this._state.score}`;
    
    if (result.cleared.rows.length || result.cleared.cols.length) {
      const totalCleared = result.cleared.rows.length + result.cleared.cols.length;
      announcement = `Cleared ${result.cleared.rows.length} row${result.cleared.rows.length !== 1 ? 's' : ''} and ${result.cleared.cols.length} column${result.cleared.cols.length !== 1 ? 's' : ''}. Score: ${this._state.score}`;
      this._vibrate(12);
      this.dispatchEvent(new CustomEvent('cleared', {
        detail: { rows: result.cleared.rows, cols: result.cleared.cols }
      }));
    }
    
    if (this._state.gameOver) {
      announcement = `Game over. Final score: ${this._state.score}`;
      this._showGameOver();
      this._vibrate([50, 50, 50]);
      this.dispatchEvent(new CustomEvent('gameover', {
        detail: { score: this._state.score }
      }));
    } else {
      this.dispatchEvent(new CustomEvent('spawn', {
        detail: { piece: this._state.preview }
      }));
    }
    
    this._announce(announcement);
    
    this.dispatchEvent(new CustomEvent('score', {
      detail: { score: this._state.score, delta: result.scoreDelta }
    }));
  }
  
  _startClearingAnimation(cleared, cellsBeforeClear) {
    // Find all cells that are being cleared
    const cellsToClear = new Set();
    
    // Add cells from cleared rows
    for (const y of cleared.rows) {
      for (let x = 0; x < this._state.w; x++) {
        cellsToClear.add(`${x},${y}`);
      }
    }
    
    // Add cells from cleared columns
    for (const x of cleared.cols) {
      for (let y = 0; y < this._state.h; y++) {
        cellsToClear.add(`${x},${y}`);
      }
    }
    
    // Start animations for all cleared cells
    const now = performance.now();
    for (const cellKey of cellsToClear) {
      const color = cellsBeforeClear.get(cellKey) || '#FFFFFF';
      this._clearingAnimations.set(cellKey, {
        startTime: now,
        color: color
      });
    }
    
    // Start animation loop
    if (this._animationFrameId === null) {
      this._animate();
    }
  }
  
  _animate() {
    const now = performance.now();
    const animationDuration = this._reducedMotion ? 50 : 300; // Faster if reduced motion
    let hasActiveAnimations = false;
    
    // Update and draw
    for (const [id, anim] of this._clearingAnimations.entries()) {
      const elapsed = now - anim.startTime;
      if (elapsed < animationDuration) {
        hasActiveAnimations = true;
      } else {
        // Animation complete, remove it
        this._clearingAnimations.delete(id);
      }
    }
    
    this._draw();
    
    if (hasActiveAnimations) {
      this._animationFrameId = requestAnimationFrame(() => this._animate());
    } else {
      this._animationFrameId = null;
      // Animation complete, update score and continue
      this._updateScore();
    }
  }
  
  _announce(message) {
    const liveRegion = this.shadowRoot.querySelector('#aria-live');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after a moment to allow re-announcement
      setTimeout(() => {
        if (liveRegion.textContent === message) {
          liveRegion.textContent = '';
        }
      }, 1000);
    }
  }
  
  _draw() {
    if (!this._state) return;
    
    const ctx = this._ctx;
    const w = this._state.w;
    const h = this._state.h;
    const cellSize = this._cellSize;
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(this).getPropertyValue('--board-bg') || '#111418';
    ctx.fillRect(0, 0, w * cellSize, h * cellSize);
    
    // Draw grid
    ctx.strokeStyle = getComputedStyle(this).getPropertyValue('--grid-stroke') || '#2a2f36';
    ctx.lineWidth = parseFloat(getComputedStyle(this).getPropertyValue('--grid-stroke-width') || '1');
    
    for (let x = 0; x <= w; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, h * cellSize);
      ctx.stroke();
    }
    
    for (let y = 0; y <= h; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(w * cellSize, y * cellSize);
      ctx.stroke();
    }
    
    // Draw pieces
    const pieceColors = {
      'I': getComputedStyle(this).getPropertyValue('--piece-I') || '#74B9FF',
      'O': getComputedStyle(this).getPropertyValue('--piece-O') || '#FDCB6E',
      'T': getComputedStyle(this).getPropertyValue('--piece-T') || '#A29BFE',
      'S': getComputedStyle(this).getPropertyValue('--piece-S') || '#55EFC4',
      'Z': getComputedStyle(this).getPropertyValue('--piece-Z') || '#FF7675',
      'J': getComputedStyle(this).getPropertyValue('--piece-J') || '#74E3FF',
      'L': getComputedStyle(this).getPropertyValue('--piece-L') || '#FAB1A0'
    };
    
    const now = performance.now();
    const animationDuration = this._reducedMotion ? 50 : 300;
    
    // Draw pieces that are not being cleared
    for (const piece of this._state.pieces.values()) {
      const color = pieceColors[piece.kind] || '#FFFFFF';
      
      for (const cell of piece.cells) {
        const worldX = piece.anchor.x + cell.x;
        const worldY = piece.anchor.y + cell.y;
        const cellKey = `${worldX},${worldY}`;
        
        // Skip if this cell is being animated (will be drawn separately)
        if (this._clearingAnimations.has(cellKey)) {
          continue;
        }
        
        const x = worldX * cellSize;
        const y = worldY * cellSize;
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      }
    }
    
    // Draw cells that are being cleared with animation
    for (const [cellKey, anim] of this._clearingAnimations.entries()) {
      const [xStr, yStr] = cellKey.split(',');
      const worldX = parseInt(xStr, 10);
      const worldY = parseInt(yStr, 10);
      
      const elapsed = now - anim.startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      if (progress >= 1) {
        // Animation complete, will be removed in _animate()
        continue;
      }
      
      // Ease-out animation (starts fast, ends slow)
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = 1 - eased; // Shrink from 1 to 0
      const alpha = 1 - eased; // Fade from 1 to 0
      
      const x = worldX * cellSize;
      const y = worldY * cellSize;
      const size = (cellSize - 2) * scale;
      const offset = (cellSize - size) / 2;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = anim.color;
      ctx.fillRect(x + 1 + offset, y + 1 + offset, size, size);
      ctx.restore();
    }
    
    // Draw preview
    this._drawPreview();
  }
  
  _drawPreview() {
    if (!this._state || !this._state.preview) return;
    
    const ctx = this._previewCtx;
    const preview = this._state.preview;
    const previewSize = 96; // 6x6 grid (slightly bigger than 5x5)
    const gridSize = 6; // 6x6 grid
    const cellSize = previewSize / gridSize; // 16 pixels per cell
    
    // Clear
    ctx.fillStyle = getComputedStyle(this).getPropertyValue('--preview-bg') || '#1a1d24';
    ctx.fillRect(0, 0, previewSize, previewSize);
    
    // Draw preview piece
    const pieceColors = {
      'I': getComputedStyle(this).getPropertyValue('--piece-I') || '#74B9FF',
      'O': getComputedStyle(this).getPropertyValue('--piece-O') || '#FDCB6E',
      'T': getComputedStyle(this).getPropertyValue('--piece-T') || '#A29BFE',
      'S': getComputedStyle(this).getPropertyValue('--piece-S') || '#55EFC4',
      'Z': getComputedStyle(this).getPropertyValue('--piece-Z') || '#FF7675',
      'J': getComputedStyle(this).getPropertyValue('--piece-J') || '#74E3FF',
      'L': getComputedStyle(this).getPropertyValue('--piece-L') || '#FAB1A0'
    };
    
    ctx.fillStyle = pieceColors[preview.kind] || '#FFFFFF';
    
    // Calculate bounds of the piece
    const bounds = {
      minX: Math.min(...preview.cells.map(c => c.x)),
      maxX: Math.max(...preview.cells.map(c => c.x)),
      minY: Math.min(...preview.cells.map(c => c.y)),
      maxY: Math.max(...preview.cells.map(c => c.y))
    };
    
    // Calculate piece dimensions in cells
    const pieceWidth = bounds.maxX - bounds.minX + 1;
    const pieceHeight = bounds.maxY - bounds.minY + 1;
    
    // Center the piece in the 6x6 grid
    const centerX = gridSize / 2;
    const centerY = gridSize / 2;
    const offsetX = centerX - (bounds.minX + pieceWidth / 2);
    const offsetY = centerY - (bounds.minY + pieceHeight / 2);
    
    // Draw each cell of the piece
    for (const cell of preview.cells) {
      const gridX = cell.x + offsetX;
      const gridY = cell.y + offsetY;
      const x = gridX * cellSize;
      const y = gridY * cellSize;
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    }
  }
  
  _updateScore() {
    const scoreEl = this.shadowRoot.querySelector('#score-value');
    const highScoreEl = this.shadowRoot.querySelector('#high-score-value');
    
    if (scoreEl) {
      scoreEl.textContent = this._state.score.toString();
    }
    
    if (this._state.score > this._highScore) {
      this._highScore = this._state.score;
      this._saveHighScore();
    }
    
    if (highScoreEl) {
      highScoreEl.textContent = this._highScore.toString();
    }
  }
  
  _showGameOver() {
    const gameOverEl = this.shadowRoot.querySelector('#game-over');
    const finalScoreEl = this.shadowRoot.querySelector('#final-score');
    
    if (gameOverEl) {
      gameOverEl.style.display = 'block';
    }
    
    if (finalScoreEl) {
      finalScoreEl.textContent = this._state.score.toString();
    }
  }
  
  _hideGameOver() {
    const gameOverEl = this.shadowRoot.querySelector('#game-over');
    if (gameOverEl) {
      gameOverEl.style.display = 'none';
    }
  }
  
  _vibrate(pattern) {
    if (!this._hapticsEnabled || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors
    }
  }
  
  _getDailySeed() {
    // Get date in America/New_York timezone
    const now = new Date();
    const nyDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = nyDate.getFullYear();
    const month = String(nyDate.getMonth() + 1).padStart(2, '0');
    const day = String(nyDate.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    // Convert to number seed
    return parseInt(dateStr, 10);
  }
  
  _loadSettings() {
    try {
      const settings = localStorage.getItem('tetro2048.settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this._hapticsEnabled = parsed.haptics === true;
        if (parsed.theme) {
          this.setTheme(parsed.theme);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  _saveSettings() {
    try {
      const settings = {
        haptics: this._hapticsEnabled,
        theme: this.getAttribute('theme') || 'minimal'
      };
      localStorage.setItem('tetro2048.settings', JSON.stringify(settings));
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  _loadHighScore() {
    try {
      const highScore = localStorage.getItem('tetro2048.highscore');
      if (highScore) {
        this._highScore = parseInt(highScore, 10) || 0;
      }
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  _saveHighScore() {
    try {
      localStorage.setItem('tetro2048.highscore', this._highScore.toString());
    } catch (e) {
      // Ignore storage errors
    }
  }
}

customElements.define('tetro-2048-board', Tetro2048Board);

