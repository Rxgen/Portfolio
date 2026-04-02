/**
 * Portfolio site — vanilla JS
 * Mobile nav, scroll-spy (active nav), intersection reveal, contact form validation
 */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelectorAll(".nav__link[href^='#']");

  /** Sections observed for active nav highlighting */
  /** Match nav anchors only so one link stays highlighted through the CTA band */
  const sectionIds = ["about", "skills", "projects", "contact"];

  // ---------------------------------------------------------------------------
  // Current year in footer
  // ---------------------------------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------------------------
  // Mobile navigation toggle
  // ---------------------------------------------------------------------------
  function setMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
          setMenuOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMenuOpen(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Scroll spy: highlight active section in navbar
  // ---------------------------------------------------------------------------
  function clearActiveLinks() {
    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });
  }

  function setActiveForId(id) {
    clearActiveLinks();
    const selector = '.nav__link[href="#' + id + '"]';
    const active = document.querySelector(selector);
    if (active) {
      active.classList.add("is-active");
    }
  }

  const sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (sections.length && header) {
    const headerHeight = function () {
      return header.offsetHeight || 64;
    };

    const observerOptions = {
      root: null,
      rootMargin: "-" + headerHeight() + "px 0px -55% 0px",
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (id) {
          setActiveForId(id);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY < 120) {
          clearActiveLinks();
        }
      },
      { passive: true }
    );
  }

  // ---------------------------------------------------------------------------
  // Fade-in on scroll for .reveal elements
  // ---------------------------------------------------------------------------
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ---------------------------------------------------------------------------
  // Contact form: validation + simulated success (no backend)
  // ---------------------------------------------------------------------------
  const form = document.getElementById("contact-form");
  const successBox = document.getElementById("form-success");
  const resetBtn = document.getElementById("form-reset");

  const fields = {
    name: {
      el: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: function (v) {
        const t = v.trim();
        if (t.length < 2) {
          return "Please enter your first name (at least 2 characters).";
        }
        return "";
      },
    },
    fullName: {
      el: document.getElementById("fullName"),
      error: document.getElementById("fullName-error"),
      validate: function (v) {
        const t = v.trim();
        if (t.length < 3) {
          return "Please enter your full name (at least 3 characters).";
        }
        return "";
      },
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (v) {
        const t = v.trim();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!t) {
          return "Email is required.";
        }
        if (!re.test(t)) {
          return "Please enter a valid email address.";
        }
        return "";
      },
    },
    phone: {
      el: document.getElementById("phone"),
      error: document.getElementById("phone-error"),
      validate: function (v) {
        const t = v.trim();
        if (!t) {
          return "Phone number is required.";
        }
        const digits = t.replace(/\D/g, "");
        if (digits.length < 8) {
          return "Enter a valid phone number (at least 8 digits).";
        }
        return "";
      },
    },
    city: {
      el: document.getElementById("city"),
      error: document.getElementById("city-error"),
      validate: function (v) {
        const t = v.trim();
        if (t.length < 2) {
          return "Please enter your city or region.";
        }
        return "";
      },
    },
    message: {
      el: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: function (v) {
        const t = v.trim();
        if (t.length < 20) {
          return "Please write at least 20 characters so I can understand your project.";
        }
        return "";
      },
    },
  };

  function showFieldError(key, message) {
    const f = fields[key];
    if (!f || !f.el || !f.error) return;
    f.error.textContent = message;
    f.el.classList.toggle("invalid", Boolean(message));
    f.el.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateAll() {
    let ok = true;
    Object.keys(fields).forEach(function (key) {
      const f = fields[key];
      if (!f.el) return;
      const msg = f.validate(f.el.value);
      showFieldError(key, msg);
      if (msg) ok = false;
    });
    return ok;
  }

  Object.keys(fields).forEach(function (key) {
    const f = fields[key];
    if (!f.el) return;
    f.el.addEventListener("blur", function () {
      const msg = f.validate(f.el.value);
      showFieldError(key, msg);
    });
    f.el.addEventListener("input", function () {
      if (f.el.classList.contains("invalid")) {
        const msg = f.validate(f.el.value);
        showFieldError(key, msg);
      }
    });
  });

  if (form && successBox) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateAll()) {
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      form.hidden = true;
      form.setAttribute("aria-hidden", "true");
      successBox.hidden = false;
      successBox.focus({ preventScroll: false });
    });
  }

  if (resetBtn && form && successBox) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      Object.keys(fields).forEach(function (key) {
        showFieldError(key, "");
      });
      successBox.hidden = true;
      form.hidden = false;
      form.removeAttribute("aria-hidden");
      const nameInput = fields.name.el;
      if (nameInput) {
        nameInput.focus();
      }
    });
  }
})();
