#!/bin/sh

docker build --platform linux/amd64 -t starkylife/starkynotes .
docker push starkylife/starkynotes
docker rmi starkylife/starkynotes
