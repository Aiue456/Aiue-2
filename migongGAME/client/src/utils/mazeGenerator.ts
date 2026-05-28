/**
 * Recursive backtracking maze generator with chapter-based scaling.
 * 0 = path, 1 = wall, 2 = exit, 3 = NPC, 4 = hazard
 */

export interface MazeResult {
  grid: number[][]
  exitPos: { x: number; y: number }
}

export interface MazeOptions {
  cols: number
  rows: number
  /** How many NPCs to place */
  npcCount: number
  /** How many hazards to place */
  hazardCount: number
  /** Extra walls to add after generation for density */
  extraWalls: number
}

const DIRECTIONS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
]

const CARVE_DIRS = [
  { dx: 0, dy: -2 },
  { dx: 2, dy: 0 },
  { dx: 0, dy: 2 },
  { dx: -2, dy: 0 },
]

/** BFS check: can the player walk from (sx,sy) to (ex,ey) ignoring walls only? */
export function canReach(grid: number[][], sx: number, sy: number, ex: number, ey: number): boolean {
  const h = grid.length
  const w = grid[0]?.length || 0
  if (h === 0 || w === 0) return false

  const visited: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false))
  const queue: { x: number; y: number }[] = [{ x: sx, y: sy }]
  visited[sy][sx] = true

  while (queue.length > 0) {
    const { x, y } = queue.shift()!
    if (x === ex && y === ey) return true

    for (const d of DIRECTIONS) {
      const nx = x + d.dx
      const ny = y + d.dy
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx] && grid[ny][nx] !== 1) {
        visited[ny][nx] = true
        queue.push({ x: nx, y: ny })
      }
    }
  }

  return false
}

interface PathNode {
  x: number; y: number
  prev: PathNode | null
}

/** BFS shortest path from (sx,sy) to (ex,ey), returns cell at ~50% distance or null if unreachable */
export function findPathMidpoint(grid: number[][], sx: number, sy: number, ex: number, ey: number): { x: number; y: number } | null {
  const h = grid.length
  const w = grid[0]?.length || 0
  if (h === 0 || w === 0) return null

  const visited: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false))
  const start: PathNode = { x: sx, y: sy, prev: null }
  const queue: PathNode[] = [start]
  visited[sy][sx] = true

  let endNode: PathNode | null = null

  while (queue.length > 0) {
    const node = queue.shift()!
    if (node.x === ex && node.y === ey) {
      endNode = node
      break
    }

    for (const d of DIRECTIONS) {
      const nx = node.x + d.dx
      const ny = node.y + d.dy
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx] && grid[ny][nx] !== 1) {
        visited[ny][nx] = true
        queue.push({ x: nx, y: ny, prev: node })
      }
    }
  }

  if (!endNode) return null

  // Reconstruct path
  const path: { x: number; y: number }[] = []
  let cur: PathNode | null = endNode
  while (cur) {
    path.push({ x: cur.x, y: cur.y })
    cur = cur.prev
  }
  path.reverse()

  // Return cell at ~50% of the path
  const mid = Math.floor(path.length / 2)
  return path[mid]
}

function buildMaze(w: number, h: number, npcCount: number, hazardCount: number, extraWalls: number): { grid: number[][]; exitX: number; exitY: number } {
  // Initialize grid with walls
  const grid: number[][] = []
  for (let y = 0; y < h; y++) {
    grid[y] = new Array(w).fill(1)
  }

  const startX = 1
  const startY = 1

  // Carve passages using recursive backtracking
  grid[startY][startX] = 0
  const stack = [{ x: startX, y: startY }]

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const shuffled = CARVE_DIRS.sort(() => Math.random() - 0.5)

    let carved = false
    for (const dir of shuffled) {
      const nx = current.x + dir.dx
      const ny = current.y + dir.dy
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 1) {
        grid[ny][nx] = 0
        grid[current.y + dir.dy / 2][current.x + dir.dx / 2] = 0
        stack.push({ x: nx, y: ny })
        carved = true
        break
      }
    }

    if (!carved) stack.pop()
  }

  const exitX = w - 2
  const exitY = h - 2
  grid[exitY][exitX] = 2

  // Collect open cells
  const openCells: { x: number; y: number }[] = []
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (grid[y][x] === 0) openCells.push({ x, y })
    }
  }
  const shuffled = openCells.sort(() => Math.random() - 0.5)

  // Place NPCs
  let placedNpcs = 0
  for (const cell of shuffled) {
    if (Math.abs(cell.x - startX) + Math.abs(cell.y - startY) <= 4) continue
    if (Math.abs(cell.x - exitX) + Math.abs(cell.y - exitY) <= 4) continue
    if (placedNpcs >= npcCount) break
    grid[cell.y][cell.x] = 3
    placedNpcs++
  }

  // Place hazards
  let placedHazards = 0
  for (const cell of shuffled) {
    if (grid[cell.y][cell.x] !== 0) continue
    if (Math.abs(cell.x - startX) + Math.abs(cell.y - startY) <= 3) continue
    if (Math.abs(cell.x - exitX) + Math.abs(cell.y - exitY) <= 3) continue
    if (placedHazards >= hazardCount) break
    grid[cell.y][cell.x] = 4
    placedHazards++
  }

  // Add extra walls for complexity
  let placedWalls = 0
  for (const cell of shuffled) {
    if (grid[cell.y][cell.x] !== 0) continue
    if (Math.abs(cell.x - startX) + Math.abs(cell.y - startY) <= 2) continue
    if (Math.abs(cell.x - exitX) + Math.abs(cell.y - exitY) <= 2) continue
    if (placedWalls >= extraWalls) break

    let openNeighbors = 0
    for (const d of CARVE_DIRS) {
      const nx = cell.x + d.dx / 2
      const ny = cell.y + d.dy / 2
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 0) {
        openNeighbors++
      }
    }
    if (openNeighbors >= 2) {
      grid[cell.y][cell.x] = 1
      placedWalls++

      // Undo if it breaks reachability
      if (!canReach(grid, startX, startY, exitX, exitY)) {
        grid[cell.y][cell.x] = 0
        placedWalls--
      }
    }
  }

  return { grid, exitX, exitY }
}

const MAX_RETRIES = 20

export function generateMaze(options: MazeOptions): MazeResult {
  const { cols, rows, npcCount, hazardCount, extraWalls } = options
  const w = cols % 2 === 0 ? cols - 1 : cols
  const h = rows % 2 === 0 ? rows - 1 : rows
  const startX = 1
  const startY = 1

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { grid, exitX, exitY } = buildMaze(w, h, npcCount, hazardCount, extraWalls)

    if (canReach(grid, startX, startY, exitX, exitY)) {
      return { grid, exitPos: { x: exitX, y: exitY } }
    }
  }

  // Fallback: generate without extra walls
  const { grid, exitX, exitY } = buildMaze(w, h, npcCount, hazardCount, 0)
  return { grid, exitPos: { x: exitX, y: exitY } }
}
