#!/bin/sh

echo Pulling commit data from $1/commits
curl $1/commits > ./random-utils/github-pages/rpr1.txt

grep "aria-label=\"Copy the full SHA\"" ./random-utils/github-pages/rpr1.txt > ./random-utils/github-pages/rpr1-out.txt \
  && node ./random-utils/process-shas.js

file="/Users/codrinmares/Personal/ccc/random-utils/github-pages/sha-string.txt"

sha_string=$(cat "$file")

echo https://www.gitclear.com/entities/open_repos/elastic/elasticsearch/commit_groups/from?shas=$sha_string

open $1
open https://www.gitclear.com/entities/open_repos/elastic/elasticsearch/commit_groups/from?shas=$sha_string