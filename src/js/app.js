document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
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

  const testimonials = document.querySelectorAll(
    ".testimonial-slides .testimonial",
  );
  const testimonialSlides = document.querySelector(".testimonial-slides");
  const testimonialDots = document.querySelector(".testimonials .dots");

  let activeTestimonial = 0;
  let testimonialAutoplayId = null;

  const renderTestimonials = () => {
    testimonials.forEach((card, index) => {
      card.classList.toggle("active", index === activeTestimonial);
    });

    const dots = testimonialDots?.querySelectorAll("button") || [];
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeTestimonial);
    });
  };

  const goToTestimonial = (index) => {
    if (!testimonials.length) return;
    activeTestimonial = (index + testimonials.length) % testimonials.length;
    renderTestimonials();
  };

  const startTestimonialAutoplay = () => {
    if (testimonialAutoplayId || !testimonials.length) return;
    testimonialAutoplayId = setInterval(() => {
      goToTestimonial(activeTestimonial + 1);
    }, AUTOPLAY_DELAY);
  };

  const stopTestimonialAutoplay = () => {
    clearInterval(testimonialAutoplayId);
    testimonialAutoplayId = null;
  };

  testimonialDots?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const index = Number(button.dataset.slideNumber) - 1;
    if (!Number.isNaN(index)) goToTestimonial(index);
  });

  testimonialSlides?.addEventListener("mouseenter", stopTestimonialAutoplay);
  testimonialSlides?.addEventListener("mouseleave", startTestimonialAutoplay);

  renderTestimonials();
  startTestimonialAutoplay();

  const filterList = document.querySelector(".filter-list");
  const projects = document.querySelectorAll(".project-grid .project");

  const getProjectTags = (project) => {
    const tags = new Set(
      (project.dataset.tags || project.dataset.category || "")
        .split(/\s+/)
        .filter(Boolean),
    );

    if (project.dataset.category) {
      tags.add(project.dataset.category);
    }

    return [...tags];
  };

  const applyProjectFilters = (selectedFilters) => {
    const filterButtons = filterList?.querySelectorAll("button") || [];

    filterButtons.forEach((button) => {
      const isAllButton = button.dataset.filter === "all";
      const shouldBeActive = isAllButton
        ? selectedFilters.size === 0
        : selectedFilters.has(button.dataset.filter);
      button.classList.toggle("active", shouldBeActive);
    });

    projects.forEach((project) => {
      const projectTags = getProjectTags(project);
      const matches =
        selectedFilters.size === 0 ||
        [...selectedFilters].some((tag) => projectTags.includes(tag));
      project.classList.toggle("is-hidden", !matches);
    });
  };

  filterList?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const selected = new Set(
      [...filterList.querySelectorAll("button")]
        .filter(
          (item) =>
            item.dataset.filter !== "all" && item.classList.contains("active"),
        )
        .map((item) => item.dataset.filter),
    );

    if (button.dataset.filter === "all") {
      applyProjectFilters(new Set());
      return;
    }

    if (selected.has(button.dataset.filter)) {
      selected.delete(button.dataset.filter);
    } else {
      selected.add(button.dataset.filter);
    }

    applyProjectFilters(selected);
  });

  applyProjectFilters(new Set());

  const contactForm = document.querySelector(".contact-form");
  const successModal = document.querySelector(".success-modal");
  const closeModalButton = document.querySelector(".success-modal__close");

  const openSuccessModal = () => {
    successModal?.classList.add("is-visible");
    successModal?.setAttribute("aria-hidden", "false");
  };

  const closeSuccessModal = () => {
    successModal?.classList.remove("is-visible");
    successModal?.setAttribute("aria-hidden", "true");
  };

  closeModalButton?.addEventListener("click", closeSuccessModal);
  successModal?.addEventListener("click", (event) => {
    if (event.target === successModal) {
      closeSuccessModal();
    }
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      website: formData.get("website")?.toString().trim() || "",
      message: formData.get("message")?.toString().trim() || "",
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jsonplaceholder.typicode.com/users", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        contactForm.reset();
        openSuccessModal();
        return;
      }

      alert("There was a problem sending your message. Please try again.");
    };

    xhr.onerror = () => {
      alert("There was a problem sending your message. Please try again.");
    };

    xhr.send(JSON.stringify(payload));
  });
});
