---
title: "加载器-旋转变色效果"
date: "2025-10-10T19:18:42+08:00"
description: "采用现代毛玻璃（Glassmorphism）设计风格的加载器动画效果。该加载器包含两种不同的毛玻璃效果实现"
cover:
  image: './cover.png'
  hiddenInSingle: true
jsFiddleScript: "//jsfiddle.net/fruritsdrink/sb80yz1p/48/embed/result"
tags: ["css","animate"]
author: "水果饮料"
draft: false

weight:  #可以用于置顶
showToc: true # 显示目录
TocOpen: false # 打开目录
comments: false # 评论
searchHidden: false # 优化SEO
ShowReadingTime: true
ShowWordCount: false
---


这是一个采用现代毛玻璃（Glassmorphism）设计风格的加载器动画效果。该加载器包含两种不同的毛玻璃效果实现：
第一种效果：水平滑动毛玻璃球
由两个圆形元素组成，其中一个为实心蓝色球体，另一个为半透明毛玻璃效果
毛玻璃球体使用 backdrop-filter: blur(10px) 实现背景模糊效果
配合半透明背景色 rgba(56, 109, 241, 0.05) 和白色边框 rgba(255, 255, 255, 0.1)
两个球体通过水平滑动动画形成交替运动效果，营造出毛玻璃材质的视觉感受
第二种效果：旋转毛玻璃环
外层为旋转的实心圆形，内层为毛玻璃效果的环形元素
毛玻璃环同样使用背景模糊和半透明效果
外层元素持续旋转，内层毛玻璃环保持静止，形成动态对比
底部添加了阴影效果，增强立体感和毛玻璃的质感
整体设计采用淡蓝色背景 #eafdff，营造清新现代的视觉体验，完美展现了毛玻璃材质的透明、模糊和光泽特性。
