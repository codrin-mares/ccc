function permutations(arr) {
  if (arr.length === 0) {
      return [[]];
  }

  const result = [];
  for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const subPerms = permutations(rest);
      const permWithCurrent = subPerms.map(subPerm => [arr[i], ...subPerm]);
      result.push(...permWithCurrent);
  }

  return result;
}

// Example usage:
const array = ['W', 'A', 'S', 'D'];
const perms = permutations(array);
console.log(perms);