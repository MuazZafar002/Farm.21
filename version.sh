#!/bin/bash

main_version=3
# Count number of commits made in the main branch
commit_count=$(git rev-list --count main)

# Update version field in app.json file
new_version="$main_version.0.$commit_count"
sed -i "" "s/\"version\": \".*\"/\"version\": \"$new_version\"/" app.json

echo "Updated version to $new_version in app.json"