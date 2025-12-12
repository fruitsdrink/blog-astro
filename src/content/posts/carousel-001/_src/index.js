const slideData = [
  {
    img: "https://picsum.photos/800/400?random=1",
    title: "图片标题1",
  },
  {
    img: "https://picsum.photos/800/400?random=2",
    title: "图片标题2",
  },
  {
    img: "https://picsum.photos/800/400?random=3",
    title: "图片标题3",
  },
  {
    img: "https://picsum.photos/800/400?random=4",
    title: "图片标题4",
  },
  {
    img: "https://picsum.photos/800/400?random=5",
    title: "图片标题5",
  },
];

const carousel = document.getElementById("carousel");
const indicatorsContainer = document.getElementById("indicators");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let autoPlayInterval;

slideData.forEach((slide, index) => {
  const slideEl = document.createElement("div");
  slideEl.className = "slide";
  slideEl.style.backgroundImage = `url(${slide.img})`;

  const titleEl = document.createElement("div");
  titleEl.className = "slide-title";
  titleEl.textContent = slide.title;

  slideEl.appendChild(titleEl);

  carousel.appendChild(slideEl);

  const indicator = document.createElement("button");
  indicator.className = "indicator";
  if (index === 0) {
    indicator.classList.add("active");
  }
  indicator.addEventListener("click", () => goToSlide(index));
  indicatorsContainer.appendChild(indicator);
});

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  document.querySelectorAll(".indicator").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slideData.length;
  updateCarousel();
}
function prevSlide() {
  currentIndex = (currentIndex - 1 + slideData.length) % slideData.length;
  updateCarousel();
}

function startAutoPlay() {
  let timerId = setInterval(nextSlide, 4000);
  return timerId;
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  stopAutoPlay();
  autoPlayInterval = startAutoPlay();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  stopAutoPlay();
  autoPlayInterval = startAutoPlay();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

const container = document.querySelector(".carousel-container");
container.addEventListener("mouseenter", stopAutoPlay);
container.addEventListener("mouoseleave", () => {
  stopAutoPlay();
  autoPlayInterval = startAutoPlay();
});

autoPlayInterval = startAutoPlay();
