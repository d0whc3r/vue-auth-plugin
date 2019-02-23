#!/bin/bash
yarn docs:build
git clone git@github.com:d0whc3r/vue-auth-plugin.git gh-pages
cd gh-pages
rm *
cp -r ../docs/.vuepress/dist/* .
git config user.email "codeship@email"
git config user.name "codeship"
git add .
git commit -m "Deploy to GitHub Pages: ${CI_COMMIT_ID} --skip-ci"
git push origin gh-pages
