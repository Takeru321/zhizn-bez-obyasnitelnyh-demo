(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });
  }

  /* Delicate reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* Demo goal tracking. Replace with Yandex.Metrica counter. */
  function trackGoal(name) {
    // window.ym(XXXXXX, "reachGoal", name);
    console.info("[demo] goal:", name);
  }

  /* Payment: the button stays disabled until the offer is accepted */
  var offer = document.getElementById("offer");
  var payButton = document.getElementById("pay-btn");
  var payNote = document.getElementById("pay-note");

  if (offer && payButton) {
    offer.addEventListener("change", function () {
      payButton.disabled = !offer.checked;
      if (!offer.checked && payNote) payNote.hidden = true;
    });

    payButton.addEventListener("click", function () {
      trackGoal("payment");
      if (payNote) {
        payNote.hidden = false;
        payNote.textContent =
          "В демо-версии оплата не подключена. Здесь будет переход в Robokassa и чек НПД.";
      }
    });
  }

  /* Signup form: demo only, no data is sent */
  var form = document.getElementById("signup-form");
  var success = document.getElementById("form-success");

  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      trackGoal("signup");

      success.hidden = false;
      success.focus();

      form.querySelectorAll("input, textarea, button").forEach(function (field) {
        field.disabled = true;
      });
    });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
