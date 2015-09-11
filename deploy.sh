#!/bin/sh

git pull --ff-only origin p023-annecy
npm update
gulp deploy