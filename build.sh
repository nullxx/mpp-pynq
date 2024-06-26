#!/bin/bash
set -e # exit on error

_PREFIX=mpp-pynq
FRONT_CONTAINER_NAME="${_PREFIX}-front"

TARGET_PLATFORMS="linux/amd64,linux/arm/v6,linux/arm/v7,linux/arm64/v8,linux/s390x"
REPO="nullx0/mpp-pynq-front"

VERSION=$(<VERSION)

echo "This will build and push the following image to docker hub: $REPO:$VERSION"

# build the server for all platforms
docker buildx build --platform $TARGET_PLATFORMS --push -t $REPO:$VERSION -t $REPO:latest $FRONT_CONTAINER_NAME
