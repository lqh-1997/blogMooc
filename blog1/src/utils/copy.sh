#!/bin/sh
cd E:/project/blogMooc/blog1/logs
cp access.log $(date +%Y-%m-%d-%H).access.log
echo "" > access.log
