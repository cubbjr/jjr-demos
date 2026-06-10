/**
 * Nivaya Main JavaScript
 * Handles global interactions like FAQ accordions and sliders.
 */

(function () {
  "use strict";

  // --- FAQ Accordion ---
  const faqQuestions = document.querySelectorAll(".faq-item__question");
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const targetId = btn.getAttribute("data-target");
        const answer = document.getElementById(targetId);
        const item = btn.closest(".faq-item");

        if (!item || !answer) return;

        const isOpen = item.classList.contains("faq-item--open");

        // Close all other items
        document.querySelectorAll(".faq-item").forEach(function (el) {
          el.classList.remove("faq-item--open");
          const ans = el.querySelector(".faq-item__answer");
          if (ans) ans.style.display = "none";
          const que = el.querySelector(".faq-item__question");
          if (que) que.setAttribute("aria-expanded", "false");
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add("faq-item--open");
          answer.style.display = "block";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // --- Testimonials Slider ---
  const testimonials = document.querySelectorAll(".testimonial-item");
  const nextBtn = document.getElementById("nextTestimonial");
  const prevBtn = document.getElementById("prevTestimonial");

  if (testimonials.length > 0 && nextBtn && prevBtn) {
    let current = 0;

    function show(index) {
      testimonials.forEach(function (el) {
        el.classList.remove("active");
      });
      testimonials[index].classList.add("active");
      current = index;
    }

    nextBtn.addEventListener("click", function () {
      show((current + 1) % testimonials.length);
    });

    prevBtn.addEventListener("click", function () {
      show((current - 1 + testimonials.length) % testimonials.length);
    });
  }

  // --- Countdown Timer ---
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    const dataDate = countdownEl.getAttribute("data-date");
    const targetDate = new Date(dataDate + "T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        document.getElementById("days").innerText = "0";
        document.getElementById("hours").innerText = "0";
        document.getElementById("minutes").innerText = "0";
        document.getElementById("seconds").innerText = "0";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = days;
      document.getElementById("hours").innerText = hours;
      document.getElementById("minutes").innerText = minutes;
      document.getElementById("seconds").innerText = seconds;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // --- GLightbox Initialization ---
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      plyr: {
        css: 'css/plyr.css',
        js: 'js/plyr.js',
        config: {
          ratio: '16:9',
          fullscreen: { enabled: true, iosNative: true },
          youtube: { noCookie: true }
        }
      }
    });
  }

})();
