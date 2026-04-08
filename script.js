/**
 * Gushwork Assignment — vanilla JavaScript only (no frameworks)
 *
 * Required behaviors:
 * 1) Sticky navbar — position:fixed at top, always visible; .is-scrolled adds shadow on scroll.
 * 2) Product carousel — Prev/next + thumbnails; desktop: lens on viewport + floating #zoomPanelInner
 *    (background-position follows cursor). Rebinds when crossing 1025px breakpoint.
 *
 * Figma: https://www.figma.com/design/DOv07H7C2tA5UrVLhmfwfW/Gushwork-Assignment?node-id=490-8785
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---------- Skip link: move focus to <main> for keyboard users ---------- */
  function initSkipLink() {
    var skip = document.querySelector(".skip-link");
    var main = document.getElementById("main");
    if (!skip || !main) return;
    skip.addEventListener("click", function (e) {
      e.preventDefault();
      main.focus({ preventScroll: false });
    });
  }

  /* ---------- Sticky / fixed navbar (always visible; optional shadow when scrolled) ---------- */
  function initStickyHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 12);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    var header = document.getElementById("siteHeader");
    var toggle = document.getElementById("navToggle");
    if (!header || !toggle) return;

    function closeNav() {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    function openNav() {
      header.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    toggle.addEventListener("click", function () {
      if (header.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    header.querySelectorAll("#siteNav a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 899px)").matches) {
          closeNav();
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches) {
        closeNav();
      }
    });
  }

  /* ---------- Products dropdown ---------- */
  function initProductsDropdown() {
    var btn = document.getElementById("productsMenuBtn");
    var menu = document.getElementById("productsMenu");
    if (!btn || !menu) return;

    function close() {
      btn.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }

    function open() {
      btn.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) {
        open();
      } else {
        close();
      }
    });

    document.addEventListener("click", function () {
      close();
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close();
      }
    });
  }

  /* ---------- Product gallery + zoom panel ---------- */
  var GALLERY_SRCS = [
    "assets/gallery-factory-tablet.png",
    "assets/gallery-warehouse-inspector.png",
    "assets/gallery-fishnet-hero.png",
    "assets/gallery-factory-tablet.png",
    "assets/gallery-warehouse-inspector.png",
    "assets/gallery-fishnet-hero.png",
  ];

  var GALLERY_ALTS = [
    "Two technicians in high-visibility gear and hard hats review a tablet on a factory floor",
    "Supervisor in a yellow hard hat with clipboard in a bright industrial warehouse",
    "Commercial fishermen handling heavy orange fishing net on a ship deck",
    "Two technicians in high-visibility gear and hard hats review a tablet on a factory floor",
    "Supervisor in a yellow hard hat with clipboard in a bright industrial warehouse",
    "Commercial fishermen handling heavy orange fishing net on a ship deck",
  ];

  function initProductGallery() {
    var mainImg = document.getElementById("galleryMainImg");
    var viewport = document.getElementById("galleryViewport");
    var galleryFocus = document.getElementById("galleryFocus");
    var lens = document.getElementById("galleryLens");
    var prevBtn = document.getElementById("galleryPrev");
    var nextBtn = document.getElementById("galleryNext");
    var thumbs = document.querySelectorAll(".product-gallery__thumb");
    var zoomPanel = document.getElementById("zoomPanel");
    var zoomInner = document.getElementById("zoomPanelInner");
    if (!mainImg || !viewport || !prevBtn || !nextBtn || !zoomInner) return;

    var index = 0;
    /* Magnification for floating preview (Figma-style zoom window) */
    var ZOOM = 2.45;

    function updateUI() {
      mainImg.src = GALLERY_SRCS[index];
      mainImg.alt = GALLERY_ALTS[index] || "";
      thumbs.forEach(function (t, i) {
        t.classList.toggle("is-active", i === index);
        t.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      syncZoomBackground();
    }

    function syncZoomBackground() {
      zoomInner.style.backgroundImage = 'url("' + mainImg.src + '")';
    }

    function go(i) {
      var n = GALLERY_SRCS.length;
      index = ((i % n) + n) % n;
      updateUI();
    }

    prevBtn.addEventListener("click", function () {
      go(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      go(index + 1);
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        go(parseInt(thumb.getAttribute("data-index"), 10) || 0);
      });
    });

    mainImg.addEventListener("load", syncZoomBackground);

    var mqZoom = window.matchMedia("(min-width: 1025px)");
    var zoomEnter = null;
    var zoomMove = null;
    var zoomLeave = null;

    function lensSizeForViewport(rect) {
      return Math.min(rect.width * 0.32, 150);
    }

    function unbindZoom() {
      if (!zoomEnter) return;
      viewport.removeEventListener("mouseenter", zoomEnter);
      viewport.removeEventListener("mousemove", zoomMove);
      viewport.removeEventListener("mouseleave", zoomLeave);
      zoomEnter = null;
      zoomMove = null;
      zoomLeave = null;
      if (galleryFocus) {
        galleryFocus.classList.remove("is-zooming");
      }
      if (lens) {
        lens.setAttribute("aria-hidden", "true");
      }
      if (zoomPanel) {
        zoomPanel.classList.add("is-idle");
        zoomPanel.setAttribute("aria-hidden", "true");
      }
    }

    function applyZoomAtPoint(clientX, clientY) {
      if (!zoomPanel) return;
      var rect = viewport.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
      zoomPanel.classList.remove("is-idle");

      var lw = lensSizeForViewport(rect);
      if (lens) {
        var lx = x - lw / 2;
        var ly = y - lw / 2;
        lx = Math.max(0, Math.min(lx, rect.width - lw));
        ly = Math.max(0, Math.min(ly, rect.height - lw));
        lens.style.left = lx + "px";
        lens.style.top = ly + "px";
      }

      var bgW = rect.width * ZOOM;
      var bgH = rect.height * ZOOM;
      zoomInner.style.backgroundSize = bgW + "px " + bgH + "px";
      var bgX = -(x * ZOOM - rect.width / 2);
      var bgY = -(y * ZOOM - rect.height / 2);
      zoomInner.style.backgroundPosition = bgX + "px " + bgY + "px";
    }

    function bindZoom() {
      unbindZoom();
      if (!zoomPanel || prefersReducedMotion || !mqZoom.matches) return;

      zoomPanel.classList.add("is-idle");

      zoomEnter = function (e) {
        syncZoomBackground();
        if (galleryFocus) {
          galleryFocus.classList.add("is-zooming");
        }
        if (lens) {
          lens.setAttribute("aria-hidden", "false");
        }
        zoomPanel.setAttribute("aria-hidden", "false");
        applyZoomAtPoint(e.clientX, e.clientY);
      };
      zoomMove = function (e) {
        applyZoomAtPoint(e.clientX, e.clientY);
      };
      zoomLeave = function () {
        if (galleryFocus) {
          galleryFocus.classList.remove("is-zooming");
        }
        if (lens) {
          lens.setAttribute("aria-hidden", "true");
        }
        zoomPanel.classList.add("is-idle");
        zoomPanel.setAttribute("aria-hidden", "true");
      };

      viewport.addEventListener("mouseenter", zoomEnter);
      viewport.addEventListener("mousemove", zoomMove);
      viewport.addEventListener("mouseleave", zoomLeave);
    }

    if (typeof mqZoom.addEventListener === "function") {
      mqZoom.addEventListener("change", bindZoom);
    } else if (typeof mqZoom.addListener === "function") {
      mqZoom.addListener(bindZoom);
    }

    updateUI();
    bindZoom();
  }

  /* ---------- Applications horizontal slider (native overflow scroll) ---------- */
  function initAppsSlider() {
    var slider = document.getElementById("appsSlider");
    var track = document.getElementById("appsTrack");
    var prev = document.getElementById("appsPrev");
    var next = document.getElementById("appsNext");
    if (!slider || !track || !prev || !next) return;

    var cards = track.querySelectorAll(".apps-card");

    function stepWidth() {
      var card = cards[0];
      if (!card) return 0;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.gap);
      if (isNaN(gap)) gap = 24;
      return card.offsetWidth + gap;
    }

    function scrollByStep(direction) {
      var delta = stepWidth() * direction;
      slider.scrollBy({ left: delta, behavior: "smooth" });
    }

    prev.addEventListener("click", function () {
      scrollByStep(-1);
    });
    next.addEventListener("click", function () {
      scrollByStep(1);
    });

    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByStep(1);
      }
    });

    window.addEventListener(
      "resize",
      function () {
        slider.scrollLeft = 0;
      },
      { passive: true }
    );
  }

  /* ---------- Manufacturing process ---------- */
  var PROCESS_IMAGE = "assets/gallery-fishnet-hero.png";

  var PROCESS_STEP_LABELS = [
    "Raw Material",
    "Extrusion",
    "Cooling",
    "Sizing",
    "Quality Control",
    "Marking",
    "Cutting",
    "Packaging",
  ];

  var PROCESS_DATA = [
    {
      title: "High-Grade Raw Material Selection",
      desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      bullets: ["PE100 grade material", "Optimal molecular weight distribution"],
    },
    {
      title: "Precision Extrusion",
      desc: "Single-screw extruders melt and homogenize polymer before forcing it through a die to form a continuous hollow tube.",
      bullets: ["Temperature-controlled zones", "Screen packs for purity"],
    },
    {
      title: "Controlled Cooling",
      desc: "Vacuum tanks and spray cooling stabilize dimensions while preserving crystallinity for pressure performance.",
      bullets: ["Calibrated cooling ramps", "Diameter monitoring"],
    },
    {
      title: "Sizing & Calibration",
      desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains roundness and wall uniformity.",
      bullets: ["Laser OD checks", "Wall thickness sampling"],
    },
    {
      title: "Quality Control",
      desc: "Destructive and non-destructive tests validate mechanical properties, fusion integrity, and marking accuracy.",
      bullets: ["Hydrostatic proof", "Melt flow verification"],
    },
    {
      title: "Laser Marking",
      desc: "Permanent markings encode standards, lot numbers, and production data for traceability in the field.",
      bullets: ["ISO-compliant legends", "Batch QR integration"],
    },
    {
      title: "Precision Cutting",
      desc: "Automatic saws cut lengths to specification while deburring and chamfering prepare ends for fusion.",
      bullets: ["Length tolerance control", "End-face squareness"],
    },
    {
      title: "Protective Packaging",
      desc: "Coils and sticks are wrapped, labeled, and palletized to prevent UV exposure and handling damage in transit.",
      bullets: ["UV protective wrap", "Export-ready pallets"],
    },
  ];

  function initProcessSection() {
    var tabBtns = document.querySelectorAll(".process-tabs__btn");
    var titleEl = document.getElementById("processStepTitle");
    var descEl = document.getElementById("processStepDesc");
    var bulletsEl = document.getElementById("processStepBullets");
    var imgEl = document.getElementById("processCarouselImg");
    var badgeEl = document.getElementById("processStepBadge");
    var prevBtn = document.getElementById("processPrev");
    var nextBtn = document.getElementById("processNext");
    if (!titleEl || !descEl || !bulletsEl || !imgEl) return;

    var stepIndex = 0;
    var maxIndex = PROCESS_DATA.length - 1;

    function renderStep() {
      var d = PROCESS_DATA[stepIndex];
      if (!d) return;
      titleEl.textContent = d.title;
      descEl.textContent = d.desc;
      bulletsEl.innerHTML = "";
      d.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        bulletsEl.appendChild(li);
      });
      imgEl.src = PROCESS_IMAGE;
      imgEl.alt = d.title;

      var label = PROCESS_STEP_LABELS[stepIndex] || "";
      if (badgeEl) {
        badgeEl.textContent =
          "Step " + (stepIndex + 1) + "/8: " + label;
      }

      tabBtns.forEach(function (btn, i) {
        var active = i === stepIndex;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (prevBtn) {
        prevBtn.disabled = stepIndex <= 0;
      }
      if (nextBtn) {
        nextBtn.disabled = stepIndex >= maxIndex;
      }
    }

    tabBtns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        stepIndex = i;
        renderStep();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (stepIndex > 0) {
          stepIndex -= 1;
          renderStep();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (stepIndex < maxIndex) {
          stepIndex += 1;
          renderStep();
        }
      });
    }

    renderStep();
  }

  /* ---------- Testimonials (native horizontal scroll) ---------- */
  function initTestimonials() {
    var viewport = document.getElementById("testiViewport");
    var track = document.getElementById("testiTrack");
    var prev = document.getElementById("testiPrev");
    var next = document.getElementById("testiNext");
    if (!viewport || !track || !prev || !next) return;

    var cards = track.querySelectorAll(".testimonial-card");

    function stepWidth() {
      var card = cards[0];
      if (!card) return 0;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.gap);
      if (isNaN(gap)) gap = 24;
      return card.offsetWidth + gap;
    }

    function scrollByStep(direction) {
      var motionOk =
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var behavior = motionOk ? "smooth" : "auto";

      if (window.matchMedia("(max-width: 768px)").matches && cards.length) {
        var rect = viewport.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var target = null;
        var i;
        if (direction > 0) {
          for (i = 0; i < cards.length; i++) {
            var cr = cards[i].getBoundingClientRect();
            if (cr.left + cr.width / 2 > centerX + 8) {
              target = cards[i];
              break;
            }
          }
        } else {
          for (i = cards.length - 1; i >= 0; i--) {
            var cr = cards[i].getBoundingClientRect();
            if (cr.left + cr.width / 2 < centerX - 8) {
              target = cards[i];
              break;
            }
          }
        }
        if (target) {
          target.scrollIntoView({ inline: "center", block: "nearest", behavior: behavior });
          return;
        }
      }

      viewport.scrollBy({ left: direction * stepWidth(), behavior: behavior });
    }

    prev.addEventListener("click", function () {
      scrollByStep(-1);
    });
    next.addEventListener("click", function () {
      scrollByStep(1);
    });

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByStep(1);
      }
    });

    window.addEventListener(
      "resize",
      function () {
        viewport.scrollLeft = 0;
      },
      { passive: true }
    );
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var trigger = item.querySelector(".faq-item__trigger");
      var panel = item.querySelector(".faq-item__panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item").forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          var t = other.querySelector(".faq-item__trigger");
          var p = other.querySelector(".faq-item__panel");
          if (t) {
            t.setAttribute("aria-expanded", "false");
          }
          if (p) {
            p.hidden = true;
          }
        });

        if (open) {
          item.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          panel.hidden = true;
        } else {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });
  }

  /* ---------- Modals (Figma: blur overlay, fade + scale, validation) ---------- */
  function initModals() {
    var quoteModal = document.getElementById("modalQuote");
    var catModal = document.getElementById("modalCatalogue");
    var motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    function refreshCatalogueBrochureButton() {
      var email = document.getElementById("mc-email");
      var btn = document.getElementById("modalCatSubmit");
      if (!email || !btn) return;
      var ok = email.value.trim().length > 0 && email.checkValidity();
      btn.disabled = !ok;
      btn.setAttribute("aria-disabled", ok ? "false" : "true");
    }

    function openModal(modal) {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.removeAttribute("hidden");
      modal.hidden = false;

      if (modal.id === "modalCatalogue") {
        var catForm = document.getElementById("modalCatForm");
        if (catForm) {
          catForm.reset();
        }
        refreshCatalogueBrochureButton();
      } else if (modal.id === "modalQuote") {
        var qForm = document.getElementById("modalQuoteForm");
        if (qForm) {
          qForm.reset();
        }
      }

      document.body.style.overflow = "hidden";

      var reduced = motionMq.matches;
      if (reduced) {
        modal.classList.add("is-open");
      } else {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            modal.classList.add("is-open");
          });
        });
      }

      window.setTimeout(function () {
        var closeBtn = modal.querySelector(".modal__close");
        if (closeBtn) {
          closeBtn.focus();
        }
      }, reduced ? 0 : 40);
    }

    function closeModal(modal) {
      if (!modal || modal.hidden) return;

      var dlg = modal.querySelector(".modal__dialog");
      var reduced = motionMq.matches;

      function afterClose() {
        modal.setAttribute("hidden", "");
        modal.hidden = true;
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
        if (modal.id === "modalCatalogue") {
          var catForm = document.getElementById("modalCatForm");
          if (catForm) {
            catForm.reset();
          }
          refreshCatalogueBrochureButton();
        }
      }

      if (reduced || !dlg) {
        modal.classList.remove("is-open");
        afterClose();
        return;
      }

      var settled = false;
      function done() {
        if (settled) return;
        settled = true;
        dlg.removeEventListener("transitionend", onEnd);
        window.clearTimeout(fallback);
        afterClose();
      }

      function onEnd(e) {
        if (e.target !== dlg) return;
        if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
        done();
      }

      modal.classList.remove("is-open");
      var fallback = window.setTimeout(done, 360);
      dlg.addEventListener("transitionend", onEnd);
    }

    document.querySelectorAll("[data-close-modal]").forEach(function (node) {
      node.addEventListener("click", function (e) {
        var m = node.closest(".modal");
        if (m) {
          e.preventDefault();
          closeModal(m);
        }
      });
    });

    function wireOpenModal(selector, modal) {
      document.querySelectorAll(selector).forEach(function (n) {
        n.addEventListener("click", function () {
          openModal(modal);
        });
      });
    }

    wireOpenModal("#openQuoteModal", quoteModal);
    wireOpenModal("#openQuoteModal2", quoteModal);

    document.querySelectorAll("[data-open-quote]").forEach(function (el) {
      el.addEventListener("click", function () {
        openModal(quoteModal);
      });
    });

    wireOpenModal("#openCatalogueFromHero", catModal);

    var openCat = document.getElementById("openCatalogueModal");
    if (openCat) {
      openCat.addEventListener("click", function () {
        openModal(catModal);
      });
    }

    var mcEmail = document.getElementById("mc-email");
    if (mcEmail) {
      mcEmail.addEventListener("input", refreshCatalogueBrochureButton);
      mcEmail.addEventListener("blur", refreshCatalogueBrochureButton);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (quoteModal && !quoteModal.hidden) {
        closeModal(quoteModal);
      }
      if (catModal && !catModal.hidden) {
        closeModal(catModal);
      }
    });

    var quoteForm = document.getElementById("modalQuoteForm");
    if (quoteForm) {
      quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!quoteForm.reportValidity()) return;
        closeModal(quoteModal);
        quoteForm.reset();
      });
    }

    var catForm = document.getElementById("modalCatForm");
    if (catForm) {
      catForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = document.getElementById("mc-email");
        var btn = document.getElementById("modalCatSubmit");
        if (!email || !btn || btn.disabled) return;
        if (!email.value.trim() || !email.checkValidity()) {
          email.focus();
          return;
        }
        closeModal(catModal);
        catForm.reset();
        refreshCatalogueBrochureButton();
      });
    }

    var ctaForm = document.getElementById("ctaForm");
    if (ctaForm) {
      ctaForm.addEventListener("submit", function (e) {
        e.preventDefault();
        ctaForm.reset();
      });
    }

    var catalogueInlineForm = document.getElementById("catalogueInlineForm");
    if (catalogueInlineForm) {
      catalogueInlineForm.addEventListener("submit", function (e) {
        e.preventDefault();
        catalogueInlineForm.reset();
      });
    }
  }

  /* ---------- Scroll reveal (smooth section entrance) ---------- */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll(".section--reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var nodes = document.querySelectorAll(".section--reveal");
    if (!nodes.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  onReady(function () {
    initSkipLink();
    initStickyHeader();
    initMobileNav();
    initProductsDropdown();
    initProductGallery();
    initAppsSlider();
    initProcessSection();
    initTestimonials();
    initFaq();
    initModals();
    initScrollReveal();
  });
})();
