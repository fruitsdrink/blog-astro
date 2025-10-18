---
title: "加载器-旋转变色效果"
date: "2025-10-10T19:18:42+08:00"
description: "基于霓虹灯效果的旋转加载器，通过20个发光点围绕中心旋转，配合背景色相变化，营造出炫酷的科技感视觉效果。"
jsFiddle: "https://jsfiddle.net/fruritsdrink/sb80yz1p/48"
bilibili: "https://www.bilibili.com/video/BV1bS4y177dx"
youtube: "https://www.youtube.com/watch?v=ttWXapXj4cg&list=PL5e68lK9hEzeeXtsQCQYd9SAzj6u6wZpi"
preview: 
  enabled: true
---

这是一个基于霓虹灯效果的旋转加载器，通过20个发光点围绕中心旋转，配合背景色相变化，营造出炫酷的科技感视觉效果。

## HTML结构分析

```html
<div class="loader">
  <span style="--i:1;"></span>
  <span style="--i:2;"></span>
  <!-- ... 共20个span元素 -->
  <span style="--i:20;"></span>
</div>
```

- 使用20个span元素作为发光点
- 每个span通过CSS自定义属性--i设置不同的索引值（1-20）
- 这些索引值用于控制旋转角度和动画延迟

## CSS核心实现

1. 背景色相动画

```css
section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #042104;
  animation: animateBg 10s linear infinite;
}

@keyframes animateBg {
  0% {
    filter: hue-rotate(0deg);
  }
  100%{
    filter: hue-rotate(360deg);
  }
}
```

背景效果特点：

- 深绿色背景：#042104营造科技感氛围
- 色相旋转：通过hue-rotate滤镜实现360度色相变化
- 10秒循环：背景颜色持续变化，从绿色渐变到其他颜色再回到绿色

2. 加载器容器

```css
.loader {
  position: relative;
  width: 120px;
  height: 120px;
}
```

- 120px × 120px的正方形容器
- position: relative为子元素提供定位基准

3. 发光点布局

```css
.loader span {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: rotate(calc(18deg * var(--i)));
}
```

布局原理：

- 每个span占据整个容器空间
- 关键技巧：transform: rotate(calc(18deg * var(--i)))
- 18度 × 索引值 = 旋转角度
- 20个点 × 18度 = 360度，完美分布
- 例如：第1个点旋转18度，第2个点旋转36度，以此类推

4. 发光点样式

```css
.loader span::before {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #00ff0a;
  box-shadow: 0 0 10px #00ff0a,
              0 0 20px #00ff0a,
              0 0 40px #00ff0a,
              0 0 60px #00ff0a,
              0 0 80px #00ff0a,
              0 0 100px #00ff0a;
  animation: animate 2s linear infinite;
  animation-delay: calc(0.1s * var(--i));
}
```

发光效果实现：

- 圆形发光点：15px × 15px的绿色圆点
- 多层阴影：6层不同大小的阴影创造发光效果
- 10px、20px、40px、60px、80px、100px
- 每层都是相同的绿色#00ff0a
- 动画延迟：calc(0.1s * var(--i))让每个点错开0.1秒

5. 缩放动画

```css
@keyframes animate {
  0%{
    transform: scale(1);
  }
  80%,100%{
    transform: scale(0);
  }
}
```

动画效果：

- 缩放变化：从正常大小(scale(1))缩小到消失(scale(0))
- 时间控制：前80%时间保持正常大小，后20%时间快速缩小
- 2秒循环：每个发光点2秒完成一次闪烁
- 线性动画：linear确保匀速变化

视觉效果特点

- 霓虹灯效果：多层阴影营造真实的发光感
- 旋转分布：20个发光点均匀分布在圆周上
- 波浪闪烁：通过动画延迟形成波浪般的闪烁效果
- 色相变化：背景持续变色，增强视觉冲击力
- 科技感：深色背景配绿色发光，典型的科技风格

动画时序分析

- 背景色相：10秒完成一次360度色相变化
- 发光点闪烁：2秒完成一次缩放动画
- 延迟效果：20个点错开0.1秒，形成2秒的波浪效果
- 整体循环：所有动画都是无限循环
-

这个加载器完美结合了旋转布局、发光效果和色相变化，创造出极具科技感和未来感的视觉体验，非常适合用于科技类网站或应用的加载提示。
