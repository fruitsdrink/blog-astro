let count = 0;
let counter = null;
const countElement = document.getElementsByClassName("count")[0];
const loaderElement = document.getElementsByClassName("loader")[0];

document.addEventListener("DOMContentLoaded", function () {
  if (counter) {
    clearInterval(counter);
  }
  counter = setInterval(function () {
    if (count < 101) {
      countElement.textContent = `${count}%`;
      loaderElement.setAttribute("style", `width: ${count}%`);
      count++;
    } else {
      clearInterval(counter);
    }
  }, 60);
});
