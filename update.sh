#!/usr/bin/env sh

git status
git add -A
git commit -m '新增文章'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# git push -f git@github.com:darenone/zongqiang-bookmarks.git master:gh-pages
git push origin master

cd -