#!/bin/bash

level=level$1

if [ ! -d ./$level ]
then
  mkdir $level
fi

cp ~/Downloads/$level.zip ./$level/$level.zip && unzip -o ./$level/$level.zip -d ./$level 