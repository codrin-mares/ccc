import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

const sliceShas = (shas, starting, ending) => {
  if (!starting && !ending) {
    return shas;
  }

  const startIdx = shas.findIndex(sha => sha === starting);
  const endIdx = shas.findIndex(sha => sha === ending);

  if (startIdx === -1) {
    throw Error(`Cannot find start sha ${starting}`);
  }

  if (endIdx === -1) {
    throw Error(`Cannot find end sha ${ending}`);
  }

  return shas.slice(startIdx, endIdx + 1);
}

const trimShas = (shas) => {
  return shas.map(sha => sha.slice(0, 8));
}

const __dirname = path.resolve(path.dirname(''));

const lines = readFileSync(`${__dirname}/random-utils/github-pages/rpr1-out.txt`, { encoding: 'utf8'});

const regex = /[a-z0-9]{40}/gm;

const shas = lines.match(regex);


const slicedShas = sliceShas(shas);
console.log('Slices SHAS', slicedShas.length, slicedShas);

console.log('SHAS COUNT', shas.length);

const finalShaString = trimShas(slicedShas).join('-');
console.log('\nOUTPUT');
console.log(finalShaString);


writeFileSync(`/Users/codrinmares/Personal/ccc/random-utils/github-pages/sha-string.txt`, finalShaString, "utf8");


