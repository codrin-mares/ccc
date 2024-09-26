import { readFileSync, readdirSync, writeFileSync } from 'fs';


const removeExtension = (fileName) => {
  const [name] = fileName.split('.');

  return name;
}

export const readFile = (fileName) => {
  return readFileSync(fileName, { encoding: 'utf8'});
};

export const writeFile = (levelName, fileName, data) => {
  console.log(`Writting to out ${levelName} - ${fileName}`);
  return writeFileSync(`result/${levelName}/${fileName}`, data, { flag: 'w' })
}


export const process = (levelName, fileName, processor) => {
  if (fileName === '*') {
    const fileNames = readdirSync(levelName, { encoding: 'utf8'});
    const validFileNames = fileNames.filter(fName => fName.endsWith('.in'));

    console.log(`Processing all files in ${levelName}...`);
    console.log(validFileNames);

    for (const name of validFileNames) {
      const input = readFile(`${levelName}/${name}`);

      processor(removeExtension(name), input);
    }

    return;
  }

  console.log(`Processing ${levelName} - ${fileName}...`);

  const input = readFile(`${levelName}/${fileName}`);

  processor(removeExtension(fileName), input);
}

export async function tryUntilSucceed(promiseFn, maxTries=3) {
    try {
        return await promiseFn();
    } catch (e) {
        if (maxTries > 0) {
            return tryUntilSucceed(promiseFn, maxTries - 1);
        }
        throw e;
    }
}

export const splitLines = (input) => input.split('\r\n').filter(l => l);

export const readMatrix = (lines, separator = '') => {
  const mat = lines.map(line => line.split(separator));

  return mat;
}

export const stringParser = (line) => line;
export const singleIntegerParser = (line) => parseInt(line);
export const singleFloatParser = (line) => parseFloat(line);

export const multiIntegerParser = (line) => line.split(" ").map(l => parseInt(l));

export function getCountWithValues(input, initialPos = 0, parser = singleIntegerParser) {
  const lines = input.split('\r\n').filter(l => l);

  const count = singleIntegerParser(lines[initialPos]);
  const values = lines.slice(initialPos + 1, initialPos + 1 + count).map(line => parser(line));

  return {
    count,
    values,
  }
}

export function getInterimResults(CURRENT_LEVEL, fileName) {
  let tmpFile;
  try {
    tmpFile = readFile(`result/${CURRENT_LEVEL}/${fileName}.tmp`);
  } catch (e) {
    tmpFile = '';
  }

  const resultMap = tmpFile.split('\n').filter(l => l).reduce((acc, line, idx) => {
    return {
      ...acc,
      [idx]: line,
    }
  }, {});
  

  return resultMap;
}

export function saveToTmp(CURRENT_LEVEL, fileName, output) {
  let tmpFile;
  try {
    tmpFile = readFile(`result/${CURRENT_LEVEL}/${fileName}.tmp`);
  } catch (e) {
    tmpFile = '';
  }

  const tmpLines = tmpFile.split('\n');
  const currentLines = output.split('\n');
  

  if (currentLines.length >= tmpLines.length) {
    console.log(`Overwritten tmp file: Current Lines = ${currentLines.length} vs Old Lines ${tmpLines.length}`)
    writeFile(CURRENT_LEVEL, `${fileName}.tmp`, output);
  }
}

export function getAllArrayPerms(arr) {
  if (arr.length === 0) {
    return [[]];
  } 

  const result = [];
  for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const subPerms = getAllArrayPerms(rest);
      const permWithCurrent = subPerms.map(subPerm => [arr[i], ...subPerm]);
      result.push(...permWithCurrent);
  }

  return result;
}