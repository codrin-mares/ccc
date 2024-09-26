function findGroups(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const groups = [];

  function dfs(i, j, group) {
    if (i < 0 || i >= rows || j < 0 || j >= cols || visited[i][j] || matrix[i][j] === 'W') {
      return;
    }

    visited[i][j] = true;
    group.push({ i, j });

    // Check adjacent cells
    dfs(i + 1, j, group);
    dfs(i - 1, j, group);
    dfs(i, j + 1, group);
    dfs(i, j - 1, group);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j] && matrix[i][j] === 'L') {
        const group = [];
        dfs(i, j, group);
        groups.push(group);
      }
    }
  }

  return groups;
}

export function areInSameGroup(matrix, i1, j1, i2, j2) {
  const groups = findGroups(matrix);

  for (const group of groups) {
    const found1 = group.find(coord => coord.i === i1 && coord.j === j1);
    const found2 = group.find(coord => coord.i === i2 && coord.j === j2);
    if (found1 && found2) {
      return true;
    }
  }
  return false;
}

export function findPointGroup(matrix, i, j) {
  const groups = findGroups(matrix);
  
  for (const group of groups) {
    const found = group.find(coord => coord.i === i && coord.j === j);

    if (found ) {
      return group;
    }
  }
  return null;
  
}

// const matrix = [
//   "WWWWWWWWWWW",
//   "WLWWWWWWWWW",
//   "WWWWLLLLWWW",
//   "WWWLLLLLWWW",
//   "WWWLWWWLLWW",
//   "WWLLWLWWLWW",
//   "WWLLWWWWWWW",
//   "WWWWLWWWLWW",
//   "WWLWWWLLWWW",
//   "WLLWWWWWWWW",
//   "WWWWWWWWWWW"
// ];

// const result = areInSameGroup(matrix, 1, 2, 3, 4);
// console.log(result); // Output: true
