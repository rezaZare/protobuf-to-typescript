#!/bin/bash
repo=$(awk -F"=" '$1=="repo" {print $2}' api/pb/manifest.env)
rm -fr temp-api
git clone https://${repo}.git temp-api
rsync -rltz --delete api/pb temp-api/
cd temp-api
git add -A pb
git commit -m "Manual update API"
git push
cd -
rm -fr temp-api
