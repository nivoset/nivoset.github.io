/**
 * Core game logic for Tetris×2048 hybrid
 */

import { PIECE_KINDS, getPieceCells } from './pieces.js';

/** @typedef {{x:number,y:number}} Vec2 */
/** @typedef {{id:number, kind:string, rotation:0|90|180|270, anchor:Vec2, cells:Vec2[]}} Piece */
/** @typedef {{w:number,h:number, occ:Int32Array, pieces:Map<number,Piece>, preview:Piece, score:number, rng:number, gameOver:boolean, nextPieceId:number}} GameState */

/**
 * Xorshift32 PRNG
 */
class Xorshift32 {
  constructor(seed = Date.now()) {
    this.state = seed || 1;
  }
  
  next() {
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    return (this.state >>> 0) / 0xFFFFFFFF;
  }
  
  nextInt(max) {
    return Math.floor(this.next() * max);
  }
}

/**
 * Multiply vector by scalar
 * @param {Vec2} v - Vector
 * @param {number} s - Scalar
 * @returns {Vec2}
 */
function mul(v, s) {
  return { x: v.x * s, y: v.y * s };
}

/**
 * Add two vectors
 * @param {Vec2} a - First vector
 * @param {Vec2} b - Second vector
 * @returns {Vec2}
 */
function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Calculate maximum slide distance for a piece in given direction
 * @param {Piece} piece - Piece to slide
 * @param {Vec2} dir - Direction vector (normalized)
 * @param {Int32Array} occ - Occupancy grid
 * @param {number} w - Grid width
 * @param {number} h - Grid height
 * @returns {number} Maximum slide distance
 */
export function slideDistance(piece, dir, occ, w, h) {
  let dist = 0;
  outer: for (;;) {
    dist++;
    for (const c of piece.cells) {
      const nx = piece.anchor.x + c.x + dir.x * dist;
      const ny = piece.anchor.y + c.y + dir.y * dist;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
        dist--;
        break outer;
      }
      const pid = occ[ny * w + nx];
      if (pid !== -1 && pid !== piece.id) {
        dist--;
        break outer;
      }
    }
  }
  return dist;
}

/**
 * Sort pieces for movement order based on direction
 * @param {Map<number,Piece>} pieces - Pieces map
 * @param {Vec2} dir - Direction vector
 * @returns {Piece[]} Sorted pieces
 */
export function sortPiecesForDir(pieces, dir) {
  const arr = Array.from(pieces.values());
  // Sort by position in movement direction (move pieces further in direction first)
  return arr.sort((a, b) => {
    const aPos = dir.x * a.anchor.x + dir.y * a.anchor.y;
    const bPos = dir.x * b.anchor.x + dir.y * b.anchor.y;
    // For negative directions, reverse order
    if (dir.x < 0 || dir.y < 0) {
      return aPos - bPos;
    }
    return bPos - aPos;
  });
}

/**
 * Move a piece and update occupancy
 * @param {GameState} state - Game state
 * @param {Piece} piece - Piece to move
 * @param {Vec2} delta - Movement delta
 */
export function movePiece(state, piece, delta) {
  // Clear old positions
  for (const c of piece.cells) {
    const x = piece.anchor.x + c.x;
    const y = piece.anchor.y + c.y;
    if (x >= 0 && y >= 0 && x < state.w && y < state.h) {
      state.occ[y * state.w + x] = -1;
    }
  }
  
  // Update anchor
  piece.anchor = add(piece.anchor, delta);
  
  // Set new positions
  for (const c of piece.cells) {
    const x = piece.anchor.x + c.x;
    const y = piece.anchor.y + c.y;
    if (x >= 0 && y >= 0 && x < state.w && y < state.h) {
      state.occ[y * state.w + x] = piece.id;
    }
  }
}

/**
 * Find connected components using 8-neighbor connectivity
 * @param {Vec2[]} cells - Cells to check
 * @returns {Vec2[][]} Array of connected components
 */
export function components8(cells) {
  const set = new Set(cells.map(v => `${v.x},${v.y}`));
  const seen = new Set();
  const res = [];
  
  for (const key of set) {
    if (seen.has(key)) continue;
    const [sx, sy] = key.split(',').map(Number);
    const stack = [[sx, sy]];
    seen.add(key);
    const comp = [];
    
    while (stack.length) {
      const [x, y] = stack.pop();
      comp.push({ x, y });
      
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nk = `${x + dx},${y + dy}`;
          if (set.has(nk) && !seen.has(nk)) {
            seen.add(nk);
            stack.push([x + dx, y + dy]);
          }
        }
      }
    }
    res.push(comp);
  }
  
  return res;
}

/**
 * Split disconnected pieces after line clears
 * @param {GameState} state - Game state
 */
export function splitDisconnected(state) {
  const piecesToRemove = [];
  const piecesToAdd = [];
  
  for (const [id, piece] of state.pieces.entries()) {
    // Get world coordinates of piece cells
    const worldCells = piece.cells.map(c => ({
      x: piece.anchor.x + c.x,
      y: piece.anchor.y + c.y
    }));
    
    // Find connected components
    const components = components8(worldCells);
    
    if (components.length > 1) {
      // Piece is disconnected, split it
      piecesToRemove.push(id);
      
      // Clear old piece from occupancy
      for (const c of worldCells) {
        if (c.x >= 0 && c.y >= 0 && c.x < state.w && c.y < state.h) {
          state.occ[c.y * state.w + c.x] = -1;
        }
      }
      
      // Create new pieces from components
      for (const comp of components) {
        if (comp.length === 0) continue;
        
        // Find bounding box to determine anchor
        const minX = Math.min(...comp.map(c => c.x));
        const minY = Math.min(...comp.map(c => c.y));
        
        // Convert to relative cells
        const relativeCells = comp.map(c => ({
          x: c.x - minX,
          y: c.y - minY
        }));
        
        const newId = state.nextPieceId++;
        const newPiece = {
          id: newId,
          kind: piece.kind,
          rotation: piece.rotation,
          anchor: { x: minX, y: minY },
          cells: relativeCells
        };
        
        // Update occupancy
        for (const c of comp) {
          if (c.x >= 0 && c.y >= 0 && c.x < state.w && c.y < state.h) {
            state.occ[c.y * state.w + c.x] = newId;
          }
        }
        
        piecesToAdd.push(newPiece);
      }
    }
  }
  
  // Remove old pieces
  for (const id of piecesToRemove) {
    state.pieces.delete(id);
  }
  
  // Add new pieces
  for (const piece of piecesToAdd) {
    state.pieces.set(piece.id, piece);
  }
}

/**
 * Clear fully filled rows and columns
 * @param {GameState} state - Game state
 * @returns {{rows:number[], cols:number[]}} Cleared row and column indices
 */
export function clearFullLines(state) {
  const rowsToClear = [];
  const colsToClear = [];
  
  // Check rows
  for (let y = 0; y < state.h; y++) {
    let full = true;
    for (let x = 0; x < state.w; x++) {
      if (state.occ[y * state.w + x] === -1) {
        full = false;
        break;
      }
    }
    if (full) rowsToClear.push(y);
  }
  
  // Check columns
  for (let x = 0; x < state.w; x++) {
    let full = true;
    for (let y = 0; y < state.h; y++) {
      if (state.occ[y * state.w + x] === -1) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.push(x);
  }
  
  // Create set of cleared cell positions for quick lookup
  const clearedCells = new Set();
  for (const y of rowsToClear) {
    for (let x = 0; x < state.w; x++) {
      clearedCells.add(`${x},${y}`);
    }
  }
  for (const x of colsToClear) {
    for (let y = 0; y < state.h; y++) {
      clearedCells.add(`${x},${y}`);
    }
  }
  
  // Clear rows and columns in occupancy
  for (const y of rowsToClear) {
    for (let x = 0; x < state.w; x++) {
      state.occ[y * state.w + x] = -1;
    }
  }
  
  for (const x of colsToClear) {
    for (let y = 0; y < state.h; y++) {
      state.occ[y * state.w + x] = -1;
    }
  }
  
  // Remove cleared cells from pieces and remove empty pieces
  const piecesToRemove = [];
  for (const [id, piece] of state.pieces.entries()) {
    // Filter out cells that are in cleared positions
    const remainingCells = piece.cells.filter(c => {
      const x = piece.anchor.x + c.x;
      const y = piece.anchor.y + c.y;
      return !clearedCells.has(`${x},${y}`);
    });
    
    if (remainingCells.length === 0) {
      // Piece has no cells left, mark for removal
      piecesToRemove.push(id);
    } else if (remainingCells.length < piece.cells.length) {
      // Piece has some cells cleared, update it
      piece.cells = remainingCells;
      // Update occupancy for remaining cells
      for (const c of remainingCells) {
        const x = piece.anchor.x + c.x;
        const y = piece.anchor.y + c.y;
        if (x >= 0 && y >= 0 && x < state.w && y < state.h) {
          state.occ[y * state.w + x] = id;
        }
      }
    }
  }
  
  // Remove empty pieces
  for (const id of piecesToRemove) {
    state.pieces.delete(id);
  }
  
  return { rows: rowsToClear, cols: colsToClear };
}

/**
 * Rebuild occupancy grid from pieces
 * This ensures the grid is always in sync with the pieces
 * @param {GameState} state - Game state
 */
export function rebuildOccupancy(state) {
  // Clear occupancy
  state.occ.fill(-1);
  
  // Rebuild from pieces
  for (const piece of state.pieces.values()) {
    for (const c of piece.cells) {
      const x = piece.anchor.x + c.x;
      const y = piece.anchor.y + c.y;
      if (x >= 0 && y >= 0 && x < state.w && y < state.h) {
        state.occ[y * state.w + x] = piece.id;
      }
    }
  }
}

/**
 * Check if board is empty
 * @param {GameState} state - Game state
 * @returns {boolean}
 */
export function isBoardEmpty(state) {
  for (let i = 0; i < state.occ.length; i++) {
    if (state.occ[i] !== -1) return false;
  }
  return true;
}

/**
 * Settle pass: one extra slide after clears
 * @param {GameState} state - Game state
 * @param {Vec2} dir - Direction vector
 */
export function settlePass(state, dir) {
  const order = sortPiecesForDir(state.pieces, dir);
  const deltas = new Map();
  
  for (const p of order) {
    deltas.set(p.id, slideDistance(p, dir, state.occ, state.w, state.h));
  }
  
  for (const p of order) {
    const dist = deltas.get(p.id);
    if (dist > 0) {
      movePiece(state, p, mul(dir, dist));
    }
  }
}

/**
 * Check if piece can be placed at position
 * @param {GameState} state - Game state
 * @param {Piece} piece - Piece to check
 * @param {Vec2} anchor - Anchor position
 * @returns {boolean}
 */
export function canPlacePiece(state, piece, anchor) {
  for (const c of piece.cells) {
    const x = anchor.x + c.x;
    const y = anchor.y + c.y;
    if (x < 0 || y < 0 || x >= state.w || y >= state.h) {
      return false;
    }
    const pid = state.occ[y * state.w + x];
    if (pid !== -1) {
      return false;
    }
  }
  return true;
}

/**
 * Find all valid positions for a piece
 * @param {GameState} state - Game state
 * @param {Piece} piece - Piece to place
 * @returns {Vec2[]} Valid anchor positions
 */
export function findValidPositions(state, piece) {
  const positions = [];
  
  for (let y = 0; y < state.h; y++) {
    for (let x = 0; x < state.w; x++) {
      const anchor = { x, y };
      if (canPlacePiece(state, piece, anchor)) {
        positions.push(anchor);
      }
    }
  }
  
  return positions;
}

/**
 * Spawn preview piece at random valid position
 * @param {GameState} state - Game state
 * @returns {boolean} True if spawned successfully
 */
export function spawnFromPreview(state) {
  const positions = findValidPositions(state, state.preview);
  
  if (positions.length === 0) {
    return false;
  }
  
  const rng = new Xorshift32(state.rng);
  const idx = rng.nextInt(positions.length);
  const anchor = positions[idx];
  
  // Create new piece
  const newPiece = {
    id: state.nextPieceId++,
    kind: state.preview.kind,
    rotation: state.preview.rotation,
    anchor: anchor,
    cells: state.preview.cells.map(c => ({ ...c }))
  };
  
  // Update occupancy
  for (const c of newPiece.cells) {
    const x = anchor.x + c.x;
    const y = anchor.y + c.y;
    if (x >= 0 && y >= 0 && x < state.w && y < state.h) {
      state.occ[y * state.w + x] = newPiece.id;
    }
  }
  
  state.pieces.set(newPiece.id, newPiece);
  state.rng = rng.state;
  
  // Generate next preview
  generatePreview(state);
  
  return true;
}

/**
 * Generate a random preview piece
 * @param {GameState} state - Game state
 */
export function generatePreview(state) {
  const rng = new Xorshift32(state.rng);
  const kind = PIECE_KINDS[rng.nextInt(PIECE_KINDS.length)];
  const rotation = [0, 90, 180, 270][rng.nextInt(4)];
  const cells = getPieceCells(kind, rotation);
  
  state.preview = {
    id: -1, // Preview doesn't have a real ID
    kind,
    rotation: /** @type {0|90|180|270} */ (rotation),
    anchor: { x: 0, y: 0 }, // Not used for preview
    cells
  };
  
  state.rng = rng.state;
}

/**
 * Initialize game state
 * @param {number} w - Grid width
 * @param {number} h - Grid height
 * @param {number} seed - RNG seed (optional)
 * @returns {GameState}
 */
export function initGameState(w = 11, h = 11, seed = null) {
  const rng = new Xorshift32(seed || Date.now());
  const state = {
    w,
    h,
    occ: new Int32Array(w * h).fill(-1),
    pieces: new Map(),
    preview: null,
    score: 0,
    rng: rng.state,
    gameOver: false,
    nextPieceId: 1
  };
  
  // Generate preview
  generatePreview(state);
  
  // Place first piece
  const kind = PIECE_KINDS[rng.nextInt(PIECE_KINDS.length)];
  const rotation = [0, 90, 180, 270][rng.nextInt(4)];
  const cells = getPieceCells(kind, rotation);
  
  const positions = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const anchor = { x, y };
      let valid = true;
      for (const c of cells) {
        const nx = anchor.x + c.x;
        const ny = anchor.y + c.y;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
          valid = false;
          break;
        }
      }
      if (valid) positions.push(anchor);
    }
  }
  
  if (positions.length > 0) {
    const idx = rng.nextInt(positions.length);
    const anchor = positions[idx];
    const firstPiece = {
      id: state.nextPieceId++,
      kind,
      rotation: /** @type {0|90|180|270} */ (rotation),
      anchor,
      cells: cells.map(c => ({ ...c }))
    };
    
    for (const c of firstPiece.cells) {
      const x = anchor.x + c.x;
      const y = anchor.y + c.y;
      state.occ[y * w + x] = firstPiece.id;
    }
    
    state.pieces.set(firstPiece.id, firstPiece);
    state.rng = rng.state;
  }
  
  return state;
}

/**
 * Apply swipe/move in given direction
 * Pieces will keep sliding until nothing can move
 * @param {GameState} state - Game state
 * @param {Vec2} dir - Direction vector
 * @returns {{cleared: {rows:number[], cols:number[]}, scoreDelta: number}}
 */
export function applySwipe(state, dir) {
  if (state.gameOver) return { cleared: { rows: [], cols: [] }, scoreDelta: 0 };
  
  // Keep sliding until nothing can move
  let anyMoved = true;
  while (anyMoved) {
    anyMoved = false;
    const order = sortPiecesForDir(state.pieces, dir);
    const deltas = new Map();
    
    // Calculate slide distances
    for (const p of order) {
      const dist = slideDistance(p, dir, state.occ, state.w, state.h);
      deltas.set(p.id, dist);
      if (dist > 0) {
        anyMoved = true;
      }
    }
    
    // Apply moves
    for (const p of order) {
      const dist = deltas.get(p.id);
      if (dist > 0) {
        movePiece(state, p, mul(dir, dist));
      }
    }
  }
  
  // Clear lines after initial movement
  let cleared = clearFullLines(state);
  let allClearedRows = [...cleared.rows];
  let allClearedCols = [...cleared.cols];
  let scoreDelta = 0;
  
  // If lines were cleared, handle splits and settle, then check for more lines
  if (cleared.rows.length || cleared.cols.length) {
    // Rebuild occupancy to ensure it's in sync after clearing
    rebuildOccupancy(state);
    
    // Split disconnected pieces
    splitDisconnected(state);
    
    // Rebuild occupancy after splitting
    rebuildOccupancy(state);
    
    // Settle pass - keep sliding after clears until stable
    anyMoved = true;
    while (anyMoved) {
      anyMoved = false;
      const order = sortPiecesForDir(state.pieces, dir);
      const deltas = new Map();
      
      for (const p of order) {
        const dist = slideDistance(p, dir, state.occ, state.w, state.h);
        deltas.set(p.id, dist);
        if (dist > 0) {
          anyMoved = true;
        }
      }
      
      for (const p of order) {
        const dist = deltas.get(p.id);
        if (dist > 0) {
          movePiece(state, p, mul(dir, dist));
        }
      }
    }
    
    // Check for new lines that may have formed after settling
    cleared = clearFullLines(state);
    allClearedRows.push(...cleared.rows);
    allClearedCols.push(...cleared.cols);
    
    // Rebuild occupancy after second clear
    rebuildOccupancy(state);
    
    // Calculate score based on all cleared lines in this move
    const combo = allClearedRows.length + allClearedCols.length;
    if (combo > 0) {
      scoreDelta = 100 * combo + 50 * Math.max(0, combo - 1);
      state.score += scoreDelta;
      
      // Perfect clear bonus
      if (isBoardEmpty(state)) {
        scoreDelta += 500;
        state.score += 500;
      }
    }
    
    // Return combined cleared lines
    cleared = { rows: allClearedRows, cols: allClearedCols };
  }
  
  // Spawn preview piece
  if (!spawnFromPreview(state)) {
    state.gameOver = true;
  }
  
  return { cleared, scoreDelta };
}

/**
 * Rotate preview piece 90 degrees clockwise
 * @param {GameState} state - Game state
 */
export function rotatePreview(state) {
  if (state.gameOver || !state.preview) return;
  
  const newRotation = ((state.preview.rotation + 90) % 360);
  state.preview.rotation = /** @type {0|90|180|270} */ (newRotation);
  state.preview.cells = getPieceCells(state.preview.kind, state.preview.rotation);
}

/**
 * Serialize state for undo
 * @param {GameState} state - Game state
 * @returns {string} JSON string
 */
export function serializeState(state) {
  const data = {
    w: state.w,
    h: state.h,
    occ: Array.from(state.occ),
    pieces: Array.from(state.pieces.entries()).map(([id, p]) => ({
      id: p.id,
      kind: p.kind,
      rotation: p.rotation,
      anchor: p.anchor,
      cells: p.cells
    })),
    preview: state.preview ? {
      kind: state.preview.kind,
      rotation: state.preview.rotation,
      cells: state.preview.cells
    } : null,
    score: state.score,
    rng: state.rng,
    gameOver: state.gameOver,
    nextPieceId: state.nextPieceId
  };
  return JSON.stringify(data);
}

/**
 * Deserialize state from JSON
 * @param {string} json - JSON string
 * @returns {GameState}
 */
export function deserializeState(json) {
  const data = JSON.parse(json);
  const state = {
    w: data.w,
    h: data.h,
    occ: new Int32Array(data.occ),
    pieces: new Map(data.pieces.map(p => [p.id, {
      id: p.id,
      kind: p.kind,
      rotation: p.rotation,
      anchor: p.anchor,
      cells: p.cells
    }])),
    preview: data.preview ? {
      id: -1,
      kind: data.preview.kind,
      rotation: data.preview.rotation,
      anchor: { x: 0, y: 0 },
      cells: data.preview.cells
    } : null,
    score: data.score,
    rng: data.rng,
    gameOver: data.gameOver || false,
    nextPieceId: data.nextPieceId || 1
  };
  return state;
}

