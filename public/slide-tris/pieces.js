/**
 * Tetromino piece definitions and rotation helpers
 */

/** @typedef {{x:number,y:number}} Vec2 */

/**
 * Tetromino shape definitions
 * Each piece has cells relative to anchor point (0,0)
 */
export const PIECE_DEFINITIONS = {
  I: {
    kind: 'I',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ]
  },
  O: {
    kind: 'O',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  },
  T: {
    kind: 'T',
    cells: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]
  },
  S: {
    kind: 'S',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 }
    ]
  },
  Z: {
    kind: 'Z',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  },
  J: {
    kind: 'J',
    cells: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 }
    ]
  },
  L: {
    kind: 'L',
    cells: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ]
  }
};

/**
 * All piece kinds
 */
export const PIECE_KINDS = Object.keys(PIECE_DEFINITIONS);

/**
 * Rotate a cell 90 degrees clockwise around origin
 * @param {Vec2} cell - Cell to rotate
 * @returns {Vec2} Rotated cell
 */
export function rotateCell90(cell) {
  return { x: -cell.y, y: cell.x };
}

/**
 * Rotate cells by given rotation (0, 90, 180, 270)
 * @param {Vec2[]} cells - Cells to rotate
 * @param {0|90|180|270} rotation - Rotation in degrees
 * @returns {Vec2[]} Rotated cells
 */
export function rotateCells(cells, rotation) {
  if (rotation === 0) return cells.map(c => ({ ...c }));
  
  let rotated = cells.map(c => ({ ...c }));
  const steps = rotation / 90;
  
  for (let i = 0; i < steps; i++) {
    rotated = rotated.map(rotateCell90);
  }
  
  return rotated;
}

/**
 * Get piece cells for a given kind and rotation
 * @param {string} kind - Piece kind (I, O, T, S, Z, J, L)
 * @param {0|90|180|270} rotation - Rotation in degrees
 * @returns {Vec2[]} Rotated cell positions
 */
export function getPieceCells(kind, rotation = 0) {
  const def = PIECE_DEFINITIONS[kind];
  if (!def) throw new Error(`Unknown piece kind: ${kind}`);
  return rotateCells(def.cells, rotation);
}

