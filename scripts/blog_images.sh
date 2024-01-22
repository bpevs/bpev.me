#!/bin/bash

# Instructions for this super-hardcoded script:
#  1. Copy notes dir to Desktop
#  2. Run script
# 3. Copy cache dir, and delete the temp desktop files

# TODO: skip files that already exist
# TODO: be able to run on subset of dirs

replace="\/Users\/ben\/desktop"
replacewith=""

cd
list=`find ~/desktop/notes -type d`
for directory in $list; do
dirpath=$(sed "s/$replace/$replacewith/" <<< "$directory")
cd $directory
echo "~/desktop/cache$dirpath"
mkdir -p ~/desktop/cache/fast$dirpath
mkdir -p ~/desktop/cache/normal$dirpath
mkdir -p ~/desktop/cache/detailed$dirpath
mogrify -format webp -quality 30 -auto-orient -path "/Users/ben/desktop/cache/fast$dirpath" '*.jpg' '*.png'
mogrify -format webp -quality 50 -auto-orient -path "/Users/ben/desktop/cache/normal$dirpath" '*.jpg' '*.png'
mogrify -format webp -quality 80 -auto-orient -path "/Users/ben/desktop/cache/detailed$dirpath" '*.jpg' '*.png'
mogrify -format jpg -quality 30 -auto-orient -path "/Users/ben/desktop/cache/fast$dirpath" '*.jpg'
mogrify -format jpg -quality 50 -auto-orient -path "/Users/ben/desktop/cache/normal$dirpath" '*.jpg'
mogrify -format jpg -quality 80 -auto-orient -path "/Users/ben/desktop/cache/detailed$dirpath" '*.jpg'
mogrify -format png -quality 30 -auto-orient -path "/Users/ben/desktop/cache/fast$dirpath" '*.png'
mogrify -format png -quality 50 -auto-orient -path "/Users/ben/desktop/cache/normal$dirpath" '*.png'
mogrify -format png -quality 80 -auto-orient -path "/Users/ben/desktop/cache/detailed$dirpath" '*.png'
cd
done
