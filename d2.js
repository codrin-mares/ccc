class PriorityQueue {
  constructor() {
    this.nodes = [];
  }

  enqueue(node, priority) {
    this.nodes.push({ node, priority });
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.nodes.shift().node;
  }

  isEmpty() {
    return this.nodes.length === 0;
  }
}

export function findShortestPath(matrix, startRow, startCol, endRow, endCol) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const startNode = startRow * numCols + startCol;
  const endNode = endRow * numCols + endCol;

  // Define valid neighbors for diagonal movement
  const neighborOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
  ];

  function isInsideGrid(row, col) {
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
  }

  function isNotVisited(row, col, visited) {
    return isInsideGrid(row, col) && !visited[row][col] && matrix[row][col] !== 'L';
  }

  function isNotCrossingDiagonal(startNode, endNode, node) {
    return !(
      (startNode - endNode === 1 && node - startNode === numCols) ||
      (endNode - startNode === 1 && node - startNode === -numCols) ||
      (startNode - endNode === -1 && node - startNode === -numCols) ||
      (endNode - startNode === -1 && node - startNode === numCols)
    );
  }

  const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  const cameFrom = Array.from({ length: numRows }, () => Array(numCols).fill(null));

  const gScore = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  gScore[startRow][startCol] = 0;

  const fScore = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  fScore[startRow][startCol] = heuristic(startRow, startCol, endRow, endCol);

  const openSet = new PriorityQueue();
  openSet.enqueue(startNode, fScore[startRow][startCol]);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const currentRow = Math.floor(current / numCols);
    const currentCol = current % numCols;

    if (current === endNode) {
      return reconstructPath(cameFrom, endNode);
    }

    visited[currentRow][currentCol] = true;

    for (const [rowOffset, colOffset] of neighborOffsets) {
      const neighborRow = currentRow + rowOffset;
      const neighborCol = currentCol + colOffset;
      const neighborNode = neighborRow * numCols + neighborCol;

      if (
        isNotVisited(neighborRow, neighborCol, visited) &&
        isNotCrossingDiagonal(current, endNode, neighborNode)
      ) {
        const tentativeGScore = gScore[currentRow][currentCol] + 1;

        if (tentativeGScore < gScore[neighborRow][neighborCol]) {
          cameFrom[neighborRow][neighborCol] = current;
          gScore[neighborRow][neighborCol] = tentativeGScore;
          fScore[neighborRow][neighborCol] =
            gScore[neighborRow][neighborCol] + heuristic(neighborRow, neighborCol, endRow, endCol);

          if (!openSet.nodes.find((n) => n.node === neighborNode)) {
            openSet.enqueue(neighborNode, fScore[neighborRow][neighborCol]);
          }
        }
      }
    }
  }

  return []; // No path found
}

function heuristic(row1, col1, row2, col2) {
  return Math.abs(row1 - row2) + Math.abs(col1 - col2); // Manhattan distance
}

function reconstructPath(cameFrom, current) {
  const path = [];
  while (current !== null) {
    const row = Math.floor(current / cameFrom[0].length);
    const col = current % cameFrom[0].length;
    path.unshift([row, col]);
    current = cameFrom[row][col];
  }
  return path;
}

// const matrix = [
//   "WWWWWWWWWWW",
//   "WLWWWWWWWWW",
//   "WWWSLLLLWWW",
//   "WWWLLLLLWWW",
//   "WWWLWWWLLWW",
//   "WWLLWLWWLWW",
//   "WWLLWWWWWWW",
//   "WWWWLWWWLWW",
//   "WWLWWWLLWWW",
//   "WLLWWWWWEWW",
//   "WWWWWWWWWWW"
// ];

// const startRow = 2;
// const startCol = 2;
// const endRow = 8;
// const endCol = 3;

// const path = findShortestPath(matrix, startRow, startCol, endRow, endCol);
// console.log(path); // Output: The array of steps to get from (2, 3) to (9, 8) respecting the rules.
