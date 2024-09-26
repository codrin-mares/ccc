import { process, writeFile, tryUntilSucceed, getCountWithValues, multiIntegerParser, splitLines, singleFloatParser, singleIntegerParser, readMatrix, readFile, saveToTmp, getInterimResults, getAllArrayPerms } from "./utils.js";

const CURRENT_LEVEL = 'level6';
const CURRENT_NO = '5';
const CURRENT_FILE = CURRENT_NO === '*' ? '*' : `${CURRENT_LEVEL}_${CURRENT_NO}`;
const CURRENT_IN_PATH = CURRENT_FILE === '*' ? CURRENT_FILE : `${CURRENT_FILE}.in`


let FREQ = 0;

const countOccurences = (line) => {
  let w = 0;
  let a = 0;
  let d = 0;
  let s = 0;


  line.split('').forEach(c => {
    switch (c) {
      case 'W': {
        w += 1;
        break;
      }
        
      case 'A': {
        a += 1;
        break;
      }
      case 'D': {
        d += 1;
        break;
      }
      case 'S': {
        s += 1;
        break;
      }
    }
  })

    return {
      w,
      a,
      s,
      d
    };
  }


const computeRect = (line) => {
  let maxH = 0;
  let maxW = 0;
  let minH = 0;
  let minW = 0;

  let currentH = 0;
  let currentW = 0;


  line.split('').forEach(c => {
    switch (c) {
      case 'W': {
        currentH += 1;

        if (currentH >= 0 && currentH > maxH) {
          maxH = currentH;
        }

        break;
      }
        
      case 'S': {
        currentH -= 1;

        if (currentH < 0 && currentH < minH) {
          minH = currentH;
        }

        break;
      }

      case 'A': {
        currentW -= 1;

        if (currentW < 0 && currentW < minW) {
          minW = currentW;
        }
        

        break;
      }
      case 'D': {
        currentW += 1;

        if (currentW >= 0 && currentW > maxW) {
          maxW = currentW;
        }

        break;
      }
    }
  })

  return {
    width: maxW - minW + 1,
    height: maxH - minH + 1,
  }


  // return {
  //   maxW: maxW,
  //   maxH: maxH,
  //   minW: minW,
  //   minH: minH,
  // }

}

const checkNumberOfValidMoves = (mat) => {
  let validM = 0;

  mat.forEach(row => {
    row.forEach(c => {
      if (c === '.') {
        validM += 1;
      }
    })
  });

  return validM;
}

const checkVisitCellTwice = (moves) => {
  let lastMove = '';

  for (let move of moves) {
    switch (move) {
      case 'W': {
        if (lastMove === 'S') {
          return true;
        }
        break;
      }
        
      case 'A': {
        if (lastMove === 'D') {
          return true;
        }
        break;
      }
      case 'D': {
        if (lastMove === 'A') {
          return true;
        }
        break;
      }
      case 'S': {
        if (lastMove === 'W') {
          return true;
        }
        break;
      }
    }

    lastMove = move;
  }

  return false;
}


const makeMove = (move, row, col) => {
  switch (move) {
    case 'W': {
      return {
        row: row - 1,
        col,
      }
    }
    case 'S': {
      return {
        row: row + 1,
        col,
      }
    }
    case 'A': {
      return {
        row,
        col: col - 1,
      }
    }
    case 'D': {
      return {
        row,
        col: col + 1,
      }
    } 
  }
}

const checkAllAreVisited = (mat, visited)  => {
  for (let row = 0; row < mat.length; row += 1) {
    for (let col = 0; col < mat[0].length; col += 1) {
      if (mat[row][col] === '.' && visited[row][col] === false) {
        return false;
      }
    }
  }

  return true;
}

const checkPercentageVisited = (mat, visited, percent) => {
  const total = mat.length * mat[0].length;
  let visitedCount = 0;


  for (let row = 0; row < mat.length; row += 1) {
    for (let col = 0; col < mat[0].length; col += 1) {
      if (visited[row][col] === true) {
        visitedCount += 1;
      }
    }
  }

  const visitedPercent = visitedCount * 100 / total;

  // console.log('VISITED PERCENT', visitedPercent);

  if (visitedPercent >= percent) {
    return true;
  }

  return false;
}


const go = (mat, moves, startRow, startCol) => {
  let currentRow = startRow;
  let currentCol = startCol;

  const visited = mat.map(row => row.map(item => false));

  visited[startRow][startCol] = true;

  for (let move of moves) {
    const { row, col} = makeMove(move, currentRow, currentCol);

    currentRow = row;
    currentCol = col;

    // console.log('MOVE', move);
    // console.log('ROW COL', `${row} ${col}`);
    

    if (row < 0 || row >= mat.length || col < 0 || col >= mat[0].length ) {
      return false;
    }

    if (visited[row][col] === true) {
      return false;
    }

    visited[row][col] = true;

    const nextPosV = mat[row][col];

    if (nextPosV === 'X') {
      return false;
    }
  }

  if (!checkAllAreVisited(mat, visited)) {
    return false;
  }

  return true;
}


const recreatePath = (mat, moves) => {
  let startPos;

  for (let row = 0; row < mat.length; row += 1) {
    for (let col = 0; col < mat[0].length; col += 1) {
      const current = mat[row][col];
      if (current === 'X') {
        continue;
      }

      startPos = current;

      // console.log('START POS', startPos);
      // console.log('START ROW COL', `${row} ${col}`);

      if (go(mat, moves, row, col)) {
        // console.log('FOUND VALID PATH', row, col, moves);

        return true;
      }
    }  
  }

  return false;
}

const recreatePathWithStartPos = (mat, moves, startRow, startCol) => {
  
  if (go(mat, moves, startRow, startCol)) {
    // console.log('FOUND VALID PATH', row, col, moves);

    return true;
  }

  return false;
}

const checkValidPath = (mat, moves, rows, cols, startRow, startCol) => {
  const { width, height} = computeRect(moves);

  // console.log('WITH', width);
  // console.log('HEIGHT', height);

  if (width > cols || height > rows) {
    console.log('INVALID DIMS', width, cols, height, rows);
    return false;
  }

  const validM = checkNumberOfValidMoves(mat);

  // console.log('VALID M', validM);
  // console.log('MOVES', moves.length);

  if (validM - 1 > moves.length) {
    console.log('INVALID MOVE NO', validM, moves.length);
    return false;
  }

  // console.log('checkVisitCellTwice(moves)', checkVisitCellTwice(moves));

  if (checkVisitCellTwice(moves)) {
    console.log('INVALID - IS VISITED TWICE');
    return false;
  }

  if ((startRow || startRow=== 0)  && (startCol || startCol === 0)) {
    return recreatePathWithStartPos(mat, moves, startRow, startCol);
  }

  return recreatePath(mat, moves)
}

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

const MOVES_ARRAY = ['D', 'S', 'A', 'W'];

function shuffleArray() {
  for (var i = MOVES_ARRAY.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * i); // no +1 here!
      var temp = MOVES_ARRAY[i];
      MOVES_ARRAY[i] = MOVES_ARRAY[j];
      MOVES_ARRAY[j] = temp;
  }

  return [...MOVES_ARRAY];
}

const getMoveSet = (tryout) => {
  // return shuffleArray(['D', 'S', 'A', 'W'])
  return shuffleArray();

  if (tryout === 0) {
    return ['S', 'D', 'A', 'W', ];
  }

  if (tryout === 1) {
    return ['D', 'S', 'A', 'W'];
  }

  if (tryout === 2) {
    return ['S', 'A', 'W', 'D'];
  }

  if (tryout === 3) {
    return ['A', 'W', 'D', 'S', ];
  }

  if (tryout === 4) {
    return ['W', 'D', 'S', 'A', ];
  }

  return ['D', 'S', 'A', 'W'];
}

// const getMoveSetRandom = (lastMove) => {
//   if (lastMove === 'D') {
//     return ['D', 'S', 'A', 'W'];
//   }

//   if (lastMove === 'S') {
//     return ['S', 'A', 'W', 'D'];
//   }

//   if (lastMove === 'A') {
//     return ['A', 'W', 'D', 'S', ];
//   }

//   if (lastMove === 'W') {
//     return ['W', 'D', 'S', 'A', ];
//   }

//   return ['D', 'S', 'A', 'W'];
// }

const doMove = (mat, visited, startRow, startCol, lastMove, moveSet, sRow, sCol, iterator, moveCount) => {
  const maxRows = mat.length;
  const maxCols = mat[0].length;

  // const moves = getMoveSet(lastMove);
  const moves = moveSet.map(m => m);
  let metTree = false;

  for (let move of moves) {
    const { row, col }= makeMove(move, startRow, startCol);

    // console.log('ROW COL', `${row} ${col}`);
    // console.log('DIMS', `${mat.length} ${mat[0].length}`);

    if (row < 0 || row >= mat.length || col < 0 || col >= mat[0].length ) {
      // console.log('OUT OF BOUND >>>', row, col, maxRows, maxCols, moves, move, sRow, sCol, iterator, moveCount);
      continue;
    }

    if (visited[row][col] === true) {
      // console.log('HIT VISITED >>>', row, col, maxRows, maxCols, moves, move, sRow, sCol, iterator, moveCount);
      continue;
    }

    if (mat[row][col] === 'X') {
      metTree = true;
      continue;
    }

    visited[row][col] = true;

    return {
      move,
      row,
      col,
      metTree,
    };
  }

  return null;
}

const isNb = (row1, col1, row2, col2) => {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

    
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

const moveToNb = (row1, col1, row2, col2) => {
  const moves = ['D', 'A', 'S', 'W'];

  for (let move of moves) {
    const { row, col }= makeMove(move, row1, col1);

    if (row === row2 && col === col2) {
      return move;
    }
  }

  return null;
}

const reversePath = (moves) => {
  return moves.reverse().map(m => {
    if (m === 'D'){
      return 'A';
    }
    if (m === 'A'){
      return 'D';
    }
    if (m === 'W'){
      return 'S';
    }
    if (m === 'S'){
      return 'W';
    }
  })
}

const makePath2 = (mat, row, col, moveSet, reverseMoveSet) => {

  let currentRow1 = row;
  let currentCol1 = col
  let currentRow2 = row;
  let currentCol2 = col
  
  const visited = mat.map(row => row.map(item => false));

  visited[row][col] = true;

  let moves1 = '';
  let moves2 = '';
  let lastMove;

  let currentMoveSet = moveSet;
  // let reverseMoveSet = shuffleArray(['D', 'S', 'A', 'W']);
  // let reverseMoveSet = reversePath([...moveSet]);
  // let reverseMoveSet = shuffleArray();
  let checkedForPercent = false;

  // console.log(`CREATING PATH STARTING FROM ${row} ${col}`, moveSet, reverseMoveSet);

  // const percent = 56;

  let firstMoves = '';
  let secondMoves = '';

  let p1IsGoing = true;
  let p2IsGoing = true;
  let countdown = 5;

  // let freq = 1;
  let round = 0;

  while(!checkAllAreVisited(mat, visited)) {
    const nextMove1 = p1IsGoing ? doMove(mat, visited, currentRow1, currentCol1, lastMove, currentMoveSet, row, col, 'first', moves1.length) : null;

    let nextMove2;

    if (round % FREQ === 0) {
      nextMove2 = p2IsGoing ? doMove(mat, visited, currentRow2, currentCol2, lastMove, reverseMoveSet, row, col, 'second', moves2.length) : null;
    }

    // console.log('NEXT MOVE', nextMove);
    // console.log('VISITED');

    // if (row === 0 && col === 0) {
    //   console.log('currentMoveset', currentMoveSet);
    //   console.log('reverseMoveset', reverseMoveSet);
    //   console.log('DIMS', `${mat.length} ${mat[0].length}`);
    //   console.log(visited.map(line => line.map(item => item ? 'V' : 'N').join(' ')).join('\n'))
    //   console.log('ARE ALL VISITED?', checkAllAreVisited(mat, visited));
    // }


    // if (!checkedForPercent && checkPercentageVisited(mat, visited, percent)) {
    //   console.log('MOVESET CHANGED FOR', percent);
    //   console.log('CURRENT MOVESET', currentMoveSet.join(' '));
    //   currentMoveSet = currentMoveSet.map(move => {
    //     if (move === 'D') return 'A';
    //     if (move === 'A') return 'D';

    //     return move;
    //   })

    //   console.log('CHANGED MOVESET', currentMoveSet.join(' '));

    //   checkedForPercent = true;
      
    // }

    // if (!p1IsGoing && !p2IsGoing) {

    if (nextMove1 === null && nextMove2 === null) {
      // console.log('THROW: Path Blocked', `${row}, ${col}, ${moveSet}, ${moves1} ${moves2}`);
      return null;
    }

    // if (nextMove1 === null || nextMove2 === null) {
    //   // console.log('THROW: Path Blocked', `${row}, ${col}, ${moveSet}, ${moves1} ${moves2}`);
    //   return null;
    // }

    if (!p1IsGoing || !p2IsGoing) {
      countdown -= 1;
    }

    if (countdown === 0) {
      return null;
    }

    if (nextMove1 !== null) {
      moves1 += nextMove1.move;
      currentRow1 = nextMove1.row;
      currentCol1 = nextMove1.col;
    } else {
      p1IsGoing = false;
    }

    if (round % FREQ === 0) {
      if (nextMove2 !== null) {
        moves2 += nextMove2.move;
        currentRow2 = nextMove2.row;
        currentCol2 = nextMove2.col;
      } else {
        p2IsGoing = false;
      }
    }



    round += 1;
    
    // lastMove = !nextMove1.metTree ? nextMove1.move : lastMove;

  } 


  if (!isNb(currentRow1, currentCol1, currentRow2, currentCol2)) {
    // console.log('IS NOT NB >>>>>')
    // console.log('STA ROW COL', currentRow1, currentCol1)
    // console.log('END ROW COL', currentRow2, currentCol2);

    console.log('THROW: Is not neighbour',`${row}, ${col}, ${moveSet}, ${moves1} ${moves2}`);
    
    return null;
  }
  
  moves1 = moves1 + moveToNb(currentRow1, currentCol1, currentRow2, currentCol2);

  // console.log('MOVES 1', moves1);
  // console.log('MOVES 2', moves2);



  moves2 = reversePath(moves2.split('').slice(1)).join('');

  // console.log('BOTH',`${moves1}${moves2}`);

  return `${moves1}${moves2}`;

}

const makePath = (mat, rows, cols, op) => {
  // const tries = [0, 1, 2, 3, 4, 5];

  const allPerms = getAllArrayPerms(['W', 'A', 'S', 'D']);


  for (const moveset of allPerms) {
    for (const reverseMoveSet of allPerms) {
    
      // const moveset = getMoveSet(t);
      // const reverseMoveSet = shuffleArray();
      // const reverseMoveSet = [...moveset];

      console.log('TRY NEW PATH WITH', FREQ, moveset, reverseMoveSet);
      // console.log('>>>>>>>>>>');

      for (let row = 0; row < mat.length; row += 1) {
        for (let col = 0; col < mat[0].length; col += 1) {
          const current = mat[row][col];
          if (current === 'X') {
            continue;
          }


          // if (row !== 0 && row !== mat.length - 1 && col !== 0 && col !== mat[0].length - 1) {
          //   continue;
          // }
      
          // console.log(`\nSTARTING NEW PATH FROM ${row} ${col}`, moveset, [...moveset].reverse())
          // console.log('DIMS', `${mat.length} ${mat[0].length}`);
          
          let res = null;

          try {
            res = makePath2(mat, row, col, moveset, reverseMoveSet);
          } catch (e) {
            console.error(e);
          }

          // console.log('RES', res);
    
          if (res !== null) {
            return {
              startRow: row,
              startCol: col,
              moves: res,
            }
          }
          
        }  
      }
    }
  }
    

  console.log(`THROW: Nothing found at ${op}`);
  throw `Notihing found at ${op}`;

}


const main = () => process(
  CURRENT_LEVEL,
  CURRENT_IN_PATH,
  (fileName, input) => {
    console.log("INPUT", input);

    FREQ += 1;

    const lines = splitLines(input);

    const ops = parseInt(lines[0]);

    let currentLinePos = 1;

    let output = '';

    const oldResults = getInterimResults(CURRENT_LEVEL, fileName);

    console.log('OLD RESULTS', oldResults);

    for (let i = 0; i < ops; i += 1) {
      console.log('LINES', lines[currentLinePos]);
      const [cols, rows] = lines[currentLinePos].split(' ').map(v => parseInt(v));
      
      const mat = readMatrix(lines.slice(currentLinePos + 1, currentLinePos + rows + 1));
      
      // console.log('ROWS COS', rows, cols);
      // console.log('MAT', mat);
      
      currentLinePos += rows + 1;

      console.log('CREATE NEW PATH FOR', i);

      const currentOldResult = oldResults[i];

      if (currentOldResult && checkValidPath(mat, currentOldResult, mat.length, mat[0].length)) {
        console.log(`USING OLD VALID RESULT FOR ITERATION ${i}`, currentOldResult);
        output += `${currentOldResult}\n`;

        continue;
      }

      const path = makePath(mat, rows, cols, i);

      console.log('path', path);


      const res = checkValidPath(mat, path.moves, mat.length, mat[0].length, path.startRow, path.startCol);

      console.log("RES>>>>>>>>>>>>", res);

      if (!res) {
        console.log(`Invalid path ${i}`);
        throw `THROW: Invalid path ${i}`;
      }

      output += `${path.moves}\n`

      saveToTmp(CURRENT_LEVEL, fileName, output);

    }


    // console.log("OUTPUT", output);
    
    writeFile(CURRENT_LEVEL, `${fileName}.out`, output);

    console.log('Finished with SUCCESS!');
   
    return;
  });

tryUntilSucceed(main, 1);
