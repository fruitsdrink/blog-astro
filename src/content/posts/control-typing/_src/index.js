const texts = [
  "欢迎来到前端世界",
  "HTML + CSS + JavaScript = 无限可能",
  "每天一个小案例，进步看得见💡",
  "你也可以成为前端高手",
];

let currentTextIndex = 0; // 当前显示文本在文本数组中的索引
let currentCharIndex = 0; // 当前显示字符在当前文本中的索引
let isDeleting = false; // 是否处于删除字符的状态
let isPaused = false; // 打字机效果是否处于暂停状态
let typingSpeed = 100; // 打字速度，单位为毫秒/字符
let deletingSpeed = 50; // 删除速度，单位为毫秒/字符

const typewriterEl = document.getElementById("typewriter");
const speedDisplayEl = document.getElementById("speedDisplay");

let timeoutId = null;

// 打字函数
function type() {
  if (isPaused) return;

  const currentText = texts[currentTextIndex];

  if (!isDeleting) {
    // 打字阶段：逐字显示
    typewriterEl.textContent = currentText.substring(0, currentCharIndex + 1);
    currentCharIndex++;

    if (currentCharIndex === currentText.length) {
      // 打完后停顿，然后开始删除
      isDeleting = true;
      timeoutId = setTimeout(type, 1500); // 停顿1.5秒
      return;
    }
  } else {
    // 删除阶段: 逐字删除
    typewriterEl.textContent = currentText.substring(0, currentCharIndex - 1);
    currentCharIndex--;

    if (currentCharIndex === 0) {
      // 删除完毕，切换到下一行
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % texts.length;
    }
  }

  // 计算下一次延迟
  const delay = isDeleting ? deletingSpeed : typingSpeed;
  timeoutId = setTimeout(type, delay);
}

// 控制函数

// 开始打字
function startTyping() {
  if (timeoutId || isPaused) {
    isPaused = false;
    if (!timeoutId) type(); // 如果被暂停过，重新启动
  } else {
    type();
  }
}

// 暂停打字
function pauseTyping() {
  isPaused = true;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

// 重置函数
function resetTyping() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  isPaused = false;
  isDeleting = false;
  currentTextIndex = 0;
  currentCharIndex = 0;
  typewriterEl.textContent = "";
  startTyping();
}

// 调整打字速度
function adjuctSpeed(delta) {
  typingSpeed = Math.max(20, Math.min(300, typingSpeed + delta));
  speedDisplayEl.textContent = `打字速度: ${typingSpeed}ms/字`;
}

// 绑定按钮事件
document.getElementById("startBtn").addEventListener("click", startTyping);
document.getElementById("pauseBtn").addEventListener("click", pauseTyping);
document.getElementById("resetBtn").addEventListener("click", resetTyping);
document
  .getElementById("fasterBtn")
  .addEventListener("click", () => adjuctSpeed(-20));
document
  .getElementById("slowerBtn")
  .addEventListener("click", () => adjuctSpeed(20));

// 页面加载时自动开始
window.addEventListener("load", () => {
  startTyping();
});

// 添加光标（用js动态插入，避免初始显示）
const observer = new MutationObserver(() => {
  // 确保光标始终在最后
  if (!document.querySelector(".cursor")) {
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    typewriterEl.appendChild(cursor);
  }
});

// 启动MutationObserver观察器，用于监听打字机元素的dom变化，包括子元素的添加、删除等操作
observer.observe(typewriterEl, { childList: true, subtree: true });
