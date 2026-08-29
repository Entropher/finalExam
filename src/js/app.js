document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const pagination = document.querySelector(".pagination-btns");
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const skillBars = document.querySelectorAll(".skill b");

  let active = 0;
  let autoplayId = null;
  let isHovered = false;
  const AUTOPLAY_DELAY = 5000;

  function render() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === active);
    });

    const buttons = pagination?.querySelectorAll("button") || [];
    buttons.forEach((button, index) => {
      button.classList.toggle("active", index === active);
    });
  }

  function next() {
    if (!slides.length) return;
    active = (active + 1) % slides.length;
    render();
  }

  function prev() {
    if (!slides.length) return;
    active = (active - 1 + slides.length) % slides.length;
    render();
  }

  function startAutoplay() {
    if (autoplayId || !slides.length) return;
    autoplayId = setInterval(() => {
      if (!isHovered) next();
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (!autoplayId) return;
    clearInterval(autoplayId);
    autoplayId = null;
  }

  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const bar = entry.target;
          const targetWidth = bar.dataset.target || "0";
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        });
      },
      { threshold: 0.35 },
    );

    skillBars.forEach((bar) => {
      const targetWidth = bar.style.width || getComputedStyle(bar).width;
      bar.dataset.target = targetWidth;
      bar.style.width = "0";
      skillObserver.observe(bar);
    });
  }

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  pagination?.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName !== "BUTTON") return;

    const index = Number(target.dataset.slideNumber) - 1;
    if (!Number.isNaN(index)) {
      active = index;
      render();
    }
  });

  sliderWrapper?.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoplay();
  });

  sliderWrapper?.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoplay();
  });

  render();
  startAutoplay();
});
