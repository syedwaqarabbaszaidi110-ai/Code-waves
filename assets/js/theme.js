/* ==========================================================================
  Code Wave — GSAP Animation System
  ========================================================================== */
(function () {
  "use strict";

  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var lenis = null;

  /* -----------------------------------------------------------------------
     Utilities
     ----------------------------------------------------------------------- */

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments,
        ctx = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  /* -----------------------------------------------------------------------
     Lenis smooth scroll, synced to ScrollTrigger
     ----------------------------------------------------------------------- */
  function initLenis() {
    if (typeof Lenis === "undefined" || reduceMotion) return;

    lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* -----------------------------------------------------------------------
     1. Loader
     ----------------------------------------------------------------------- */
  function initLoader() {
    var loader = qs("#site-loader");
    var html = document.documentElement;
    if (!loader) {
      html.classList.remove("is-loading");
      document.dispatchEvent(new CustomEvent("cw:loaded"));
      return;
    }

    var fill = qs(".loader-fill", loader);
    var label = qs(".loader-label", loader);
    var mark = qs(".loader-mark", loader);

    // Split the "CODE WAVE" wordmark into per-letter spans for a stagger reveal.
    var letters = [];
    if (mark && !mark.__cwSplit) {
      var text = mark.textContent;
      mark.innerHTML = "";
      text.split("").forEach(function (ch) {
        var span = document.createElement("span");
        span.className = "loader-letter";
        span.textContent = ch === " " ? "\u00A0" : ch;
        mark.appendChild(span);
        letters.push(span);
      });
      mark.__cwSplit = true;
    }

    if (reduceMotion) {
      html.classList.remove("is-loading");
      gsap.set(loader, {
        autoAlpha: 0,
        display: "none"
      });
      document.dispatchEvent(new CustomEvent("cw:loaded"));
      return;
    }

    gsap.set(loader, {
      clipPath: "circle(150% at 50% 50%)"
    });

    var tl = gsap.timeline({
      onComplete: function () {
        html.classList.remove("is-loading");
        loader.style.display = "none";
        document.dispatchEvent(new CustomEvent("cw:loaded"));
      }
    });

    tl.set(fill, {
      scaleX: 0,
      transformOrigin: "left center"
    })
      .from(letters, {
        yPercent: 130,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.035,
        ease: "power4.out"
      })
      .to(fill, {
        scaleX: 1,
        duration: 0.9,
        ease: "power2.inOut"
      }, "-=0.25")
      .to(label, {
        autoAlpha: 0,
        duration: 0.25
      }, "+=0.05")
      .to(letters, {
        yPercent: -130,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power3.in"
      }, "<")
      .to(loader, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.9,
        ease: "power4.inOut"
      }, "-=0.15")
      .set(loader, {
        autoAlpha: 0,
        display: "none"
      });
  }

  /* -----------------------------------------------------------------------
     2. Logo hover
     ----------------------------------------------------------------------- */
  function initLogoAnimation() {
    var logo = qs(".site-logo a");
    if (!logo || isTouch) return;

    var img = qs("img", logo);
    var tl = gsap.timeline({
      paused: true
    });
    tl.to(logo, {
      "--cw-logo-reveal": "100%",
      duration: 0.45,
      ease: "power3.out"
    }, 0)
      .to(img, {
        scale: 1.06,
        duration: 0.45,
        ease: "power3.out"
      }, 0);

    logo.addEventListener("mouseenter", function () {
      tl.play();
    });
    logo.addEventListener("mouseleave", function () {
      tl.reverse();
    });
  }

  /* -----------------------------------------------------------------------
     3. Menu hover (desktop) + mobile menu
     ----------------------------------------------------------------------- */
  function initMenuAnimations() {
    if (isTouch) return;
    qsa(".header-menu ul li a.ddl-nav-link").forEach(function (link) {
      var span = qs("span", link);
      if (!span) return;

      var underline = document.createElement("i");
      underline.className = "nav-underline";
      link.appendChild(underline);

      var setScale = gsap.quickTo(underline, "scaleX", {
        duration: 0.35,
        ease: "power3.out"
      });
      var setX = gsap.quickTo(span, "y", {
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.set(underline, {
        scaleX: 0,
        transformOrigin: "left center"
      });

      link.addEventListener("mouseenter", function () {
        setScale(1);
        setX(-2);
      });
      link.addEventListener("mouseleave", function () {
        setScale(0);
        setX(0);
      });
    });
  }

  function initMobileMenu() {
    var toggle = qs(".menu-toggle");
    var panel = qs(".mobile-menu");
    if (!toggle || !panel) return;

    var items = qsa(".mobile-menu .mobile-menu-links li");
    var backdrop = qs(".mobile-menu-backdrop", panel) || panel;
    var isOpen = false;

    var tl = gsap.timeline({
      paused: true,
      reversed: true
    })
      .set(panel, {
        display: "block"
      })
      .fromTo(panel, {
        xPercent: 100
      }, {
        xPercent: 0,
        duration: 0.5,
        ease: "power4.out"
      })
      .fromTo(items, {
        autoAlpha: 0,
        y: 24
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "power2.out"
      },
        "-=0.25"
      );

    function open() {
      isOpen = true;
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("mobile-menu-open");
      tl.timeScale(1).play();
    }

    function close() {
      isOpen = false;
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mobile-menu-open");
      tl.timeScale(1.3).reverse();
    }

    toggle.addEventListener("click", function () {
      isOpen ? close() : open();
    });
    qsa("a", panel).forEach(function (a) {
      a.addEventListener("click", close);
    });
    backdrop !== panel && backdrop.addEventListener("click", close);

    window.addEventListener("resize", debounce(function () {
      if (window.innerWidth >= 992 && isOpen) close();
    }, 200));
  }

  /* -----------------------------------------------------------------------
     4. Direction-aware header
     ----------------------------------------------------------------------- */
  function initHeaderAnimation() {
    var header = qs("header.header");
    if (!header) return;

    var revealThreshold = 120;
    var lastY = 0;
    var pinned = false;

    var hide = gsap.quickTo(header, "yPercent", {
      duration: 0.4,
      ease: "power3.out"
    });

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: function (self) {
        var y = self.scroll();

        if (y > revealThreshold && !pinned) {
          pinned = true;
          header.classList.add("is-pinned");
        } else if (y <= revealThreshold && pinned) {
          pinned = false;
          header.classList.remove("is-pinned");
          hide(0);
        }

        if (!pinned) {
          lastY = y;
          return;
        }

        if (self.direction === 1 && y > revealThreshold) {
          hide(-100); // scrolling down -> hide
        } else if (self.direction === -1) {
          hide(0); // scrolling up -> reveal
        }
        lastY = y;
      }
    });
  }

  /* -----------------------------------------------------------------------
     5/6. Hero: rotating service text + cursor image follower
     ----------------------------------------------------------------------- */
  var HERO_SERVICES = [{
    label: "Mobile App",
    img: "assets/images/mobile-app/1.webp"
  },
  {
    label: "Web Development",
    img: "assets/images/website/1.webp"
  },
  {
    label: "UI/UX Design",
    img: "assets/images/ui/1.webp"
  },
  {
    label: "Software Develop",
    img: "assets/images/software/1.webp"
  },
  {
    label: "AI Development",
    img: "assets/images/ai/1.webp"
  },
  {
    label: "Custom Solutions",
    img: "assets/images/website/1.webp"
  }
  ];

  // ============================================================
  // 5. BANNER MOUSE-TRAIL 
  // ============================================================
  const banner = document.querySelector('.banner');
  const images = gsap.utils.toArray('.brand-trail');

  let index = 0;
  let gap = 80;
  let mouse = {
    x: 0,
    y: 0
  };
  let last = {
    x: 0,
    y: 0
  };

  if (banner) {
    banner.addEventListener('mousemove', function (e) {
      const rect = banner.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      const distance = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      if (distance > gap) {
        showImage(mouse.x, mouse.y);
        last.x = mouse.x;
        last.y = mouse.y;
      }
    });
  }

  function showImage(x, y) {
    const img = images[index % images.length];
    gsap.killTweensOf(img);
    gsap.set(img, {
      x: x,
      y: y,
      xPercent: -50,
      yPercent: -50,
      scale: 0.5,
      rotation: gsap.utils.random(-20, 20),
      opacity: 1
    });
    gsap.timeline()
      .fromTo(img, {
        scale: 0.6,
        opacity: 0,
        filter: 'blur(8px)'
      }, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power3.out'
      })
      .to(img, {
        y: '-=30',
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power2.out'
      });
    index++;
  }
  /* Letter-by-letter typewriter: types each service in, holds, deletes, repeats.
     Uses TextPlugin (already loaded) to drive the character reveal itself. */
  function initHeroServices() {
    var target = qs(".banner h1.web-title span");
    if (!target) return;

    var wrap = target.parentElement;
    wrap.classList.add("hero-type-wrap");
    target.classList.add("hero-type-target");
    target.textContent = "";

    var idx = 0;

    function announce(nextIdx) {
      document.dispatchEvent(new CustomEvent("cw:heroservice", {
        detail: HERO_SERVICES[nextIdx]
      }));
    }

    function typeNext() {
      var word = HERO_SERVICES[idx].label;
      announce(idx);

      if (reduceMotion) {
        target.textContent = word;
        idx = (idx + 1) % HERO_SERVICES.length;
        setTimeout(typeNext, 2600);
        return;
      }

      wrap.classList.add("is-typing");

      gsap.timeline({
        onComplete: function () {
          idx = (idx + 1) % HERO_SERVICES.length;
          setTimeout(typeNext, 250);
        }
      })
        .to(target, {
          duration: Math.max(0.5, word.length * 0.055),
          text: word,
          ease: "none"
        })
        .to({}, {
          duration: 1.1
        }) // hold fully typed
        .to(target, {
          duration: Math.max(0.3, word.length * 0.03),
          text: "",
          ease: "none"
        })
        .call(function () {
          wrap.classList.remove("is-typing");
        });
    }

    document.addEventListener("cw:loaded", function () {
      typeNext();
    }, {
      once: true
    });
  }


  /* -----------------------------------------------------------------------
     7. Services cards: hover / button / arrow / image
     ----------------------------------------------------------------------- */
  function initServiceAnimations() {
    qsa(".services-card").forEach(function (card) {
      var wrap = card.closest(".slides-wrapper") || card.parentElement;
      var img = qs(".services-img img", wrap);
      var btn = qs(".view-services-link", card);
      var arrow = btn ? qs(".arrow", btn) : null;

      if (isTouch) return;

      card.addEventListener("mouseenter", function () {
        card.classList.add("is-hovering");
        if (img) gsap.to(img, {
          scale: 1.06,
          duration: 0.6,
          ease: "power3.out"
        });
        if (arrow) gsap.to(arrow, {
          x: 6,
          duration: 0.35,
          ease: "power3.out"
        });
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-hovering");
        if (img) gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: "power3.out"
        });
        if (arrow) gsap.to(arrow, {
          x: 0,
          duration: 0.35,
          ease: "power3.out"
        });
      });
    });
  }

  /* Our Services — Velocity Skew / Infinite Looped Panels.
     Reference: https://demos.gsap.com/demo/infinite-looped-panels/
     Each panel pins at the top of the viewport (pinSpacing:false) so the
     next panel scrolls up and covers it — the layered/looping look from
     the demo. The heading block above (.services-head) is NOT part of
     this and simply scrolls past normally, staying put until the loop
     begins underneath it.
     A clone of the first panel is appended to the end so the sequence
     rolls back into itself instead of hard-cutting into the next section
     (we don't hijack the whole page's scroll position the way the demo
     does, since this loop lives inside a bigger page with a header/
     footer that still need to scroll normally).
     On top of that, a velocity-based skew tilts each panel's image/card
     in the direction of scroll and eases back to flat the moment
     scrolling slows down — the "Velocity Skew" part of the brief. */
  function initServicesScroll() {
    var wrap = qs("#services-loop");
    if (!wrap || reduceMotion) return;

    var panels = qsa(".service-panel", wrap);
    if (!panels.length) return;

    var loopClone = panels[0].cloneNode(true);
    loopClone.classList.add("is-loop-clone");
    loopClone.setAttribute("aria-hidden", "true");
    wrap.appendChild(loopClone);

    qsa(".service-panel", wrap).forEach(function (panel) {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false
      });
    });

    var skewTargets = qsa(".service-panel .services-img img, .service-panel .services-card", wrap);
    if (!skewTargets.length) return;

    var proxy = {
      skew: 0
    };
    var clampSkew = gsap.utils.clamp(-14, 14);
    var setSkew = gsap.quickTo(skewTargets, "skewY", {
      duration: 0.5,
      ease: "power3"
    });

    ScrollTrigger.create({
      onUpdate: function (self) {
        var skew = clampSkew(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: function () {
              setSkew(proxy.skew);
            }
          });
        }
      }
    });
  }

  /* Magnetic "View Services" cursor badge — only active while hovering the
     services sections. Explicitly does NOT attach to the "Let's talk" (.talk)
     section, which has its own drag cursor behavior. Desktop/hover only;
     the inline "View Services" link in each card still works everywhere,
     including touch, for accessibility. */
  function initServicesCursor() {
    if (isTouch || reduceMotion) return;

    var sections = qsa(".service-panel");
    if (!sections.length) return;

    var badge = document.createElement("div");
    badge.className = "services-cursor-badge";
    badge.innerHTML = "<span>View Services</span>";
    document.body.appendChild(badge);

    var setX = gsap.quickTo(badge, "x", {
      duration: 0.35,
      ease: "power3"
    });
    var setY = gsap.quickTo(badge, "y", {
      duration: 0.35,
      ease: "power3"
    });
    gsap.set(badge, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      autoAlpha: 0
    });

    function onMove(e) {
      setX(e.clientX);
      setY(e.clientY);
    }

    sections.forEach(function (section) {
      section.addEventListener("mouseenter", function () {
        section.classList.add("cw-cursor-active");
        gsap.to(badge, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.35,
          ease: "back.out(2)"
        });
      });
      section.addEventListener("mouseleave", function () {
        section.classList.remove("cw-cursor-active");
        gsap.to(badge, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in"
        });
      });
      section.addEventListener("mousemove", onMove);
      section.addEventListener("click", function (e) {
        if (e.target.closest("a")) return; // let real links behave normally
        window.location.href = "services.php";
      });
    });
  }

  /* -----------------------------------------------------------------------
     9/10. Global scroll reveal — "bloom" open reveal (clip-path + scale),
     replaces the old word/line-split animation across the site.
     ----------------------------------------------------------------------- */
  function initScrollReveal() {
    var selectors = [
      ".services-head h2.web-title",
      ".services-head p",
      ".about-content h1.web-title",
      ".about-content.bottom h3.web-title",
      ".services-card h4.web-title",
      ".work-card h6.web-title",
      ".talk-head h2.web-title"
    ];

    var targets = [];
    selectors.forEach(function (sel) {
      qsa(sel).forEach(function (el) {
        targets.push(el);
      });
    });

    targets.forEach(function (el) {
      if (reduceMotion) {
        gsap.set(el, {
          clipPath: "inset(0% 0 0 0)",
          autoAlpha: 1,
          scale: 1,
          y: 0
        });
        return;
      }

      gsap.set(el, {
        clipPath: "inset(0% 0 100% 0)",
        autoAlpha: 0,
        scale: 0.94,
        y: 24,
        transformOrigin: "center bottom"
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            clipPath: "inset(0% 0 0% 0)",
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out"
          });
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     11. Brand section parallax (CodeWave)
     ----------------------------------------------------------------------- */
  function initBrandAnimation() {
    var section = qs("section.brand");
    var top = qs(".brand-name.top", section || document);
    var bottom = qs(".brand-name.bottom", section || document);
    if (!section || reduceMotion) return;

    if (top) {
      gsap.to(top, {
        x: 220,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
    if (bottom) {
      gsap.to(bottom, {
        x: -160,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5
        }
      });
    }
  }

  /* -----------------------------------------------------------------------
     12. Featured Work
     ----------------------------------------------------------------------- */
  function initFeaturedWork() {
    qsa(".work-card").forEach(function (card, i) {
      var img = qs(".img img", card);

      gsap.from(card, {
        autoAlpha: 0,
        y: 50,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%"
        }
      });

      if (isTouch) return;
      card.addEventListener("mouseenter", function () {
        if (img) gsap.to(img, {
          scale: 1.08,
          duration: 0.6,
          ease: "power3.out"
        });
      });
      card.addEventListener("mouseleave", function () {
        if (img) gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: "power3.out"
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     13/14. Drag items in "Let's talk about your project"
     ----------------------------------------------------------------------- */
  function initDragItems() {
    var section = qs(".talk");
    var container = qs(".drag-item");
    if (!section || !container) return;

    var items = qsa(".drag-item span");
    if (!items.length) return;

    var entranceDone = false;
    var bounds = null;
    var labelPool = items.map(function (item) {
      return item.textContent;
    });

    // Spread each item's starting X across the section width so they fall
    // independently rather than as one stacked column.
    function layoutStartPositions() {
      var secRect = section.getBoundingClientRect();
      var lanes = items.length;
      items.forEach(function (item, i) {
        var laneWidth = secRect.width / lanes;
        var itemWidth = item.offsetWidth || 140;
        var maxOffset = Math.max(laneWidth - itemWidth, 10);
        var startX = laneWidth * i + gsap.utils.random(10, maxOffset);
        item.__cwStartX = gsap.utils.clamp(10, secRect.width - itemWidth - 10, startX);
      });
      return secRect;
    }

    function playEntrance() {
      if (entranceDone) return;
      entranceDone = true;

      var secRect = layoutStartPositions();
      bounds = secRect;

      items.forEach(function (item) {
        gsap.set(item, {
          position: "absolute",
          top: 0,
          left: item.__cwStartX,
          zIndex: 2
        });
      });

      if (reduceMotion) {
        gsap.set(items, {
          y: function () {
            return secRect.height - (this.targets()[0].offsetHeight || 40) - 24;
          },
          autoAlpha: 1,
          rotation: 0
        });
        enableDragging(secRect);
        return;
      }

      gsap.set(items, {
        y: function () {
          return -gsap.utils.random(180, 420);
        },
        rotation: function () {
          return gsap.utils.random(-35, 35);
        },
        autoAlpha: 0,
        scale: 0.85
      });

      var tl = gsap.timeline({
        onComplete: function () {
          enableDragging(secRect);
        }
      });

      items.forEach(function (item, i) {
        var restY = secRect.height - (item.offsetHeight || 40) - gsap.utils.random(24, 70);
        tl.to(item, {
          y: restY,
          autoAlpha: 1,
          scale: 1,
          rotation: function () {
            return gsap.utils.random(-12, 12);
          },
          duration: 1.1,
          ease: "bounce.out"
        }, i * 0.09);
      });
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: playEntrance,
      once: true
    });

    function refreshBounds() {
      bounds = section.getBoundingClientRect();
    }
    window.addEventListener("resize", debounce(refreshBounds, 200));

    // Shared drag behaviour for both the original items and anything the
    // cursor trail spawns later. Reads the item's CURRENT x/y transform
    // instead of zeroing it out, so a span that just bounced to rest at
    // the bottom stays there and only becomes draggable from that point
    // — it no longer snaps back up to the top.
    function makeDraggable(item) {
      var x = gsap.getProperty(item, "x") || 0,
        y = gsap.getProperty(item, "y") || 0,
        startX = 0,
        startY = 0,
        ptrX = 0,
        ptrY = 0,
        dragging = false;
      var setX = gsap.quickSetter(item, "x", "px");
      var setY = gsap.quickSetter(item, "y", "px");
      var lastMoveTime = 0,
        vx = 0,
        vy = 0;

      item.style.touchAction = "none";
      item.style.cursor = "grab";

      item.addEventListener("mouseenter", function () {
        if (!dragging) gsap.to(item, {
          scale: 1.06,
          duration: 0.25
        });
      });
      item.addEventListener("mouseleave", function () {
        if (!dragging) gsap.to(item, {
          scale: 1,
          duration: 0.25
        });
      });

      item.addEventListener("pointerdown", function (e) {
        dragging = true;
        item.setPointerCapture(e.pointerId);
        item.style.cursor = "grabbing";
        refreshBounds();
        x = gsap.getProperty(item, "x") || 0;
        y = gsap.getProperty(item, "y") || 0;
        startX = x;
        startY = y;
        ptrX = e.clientX;
        ptrY = e.clientY;
        lastMoveTime = performance.now();
        vx = 0;
        vy = 0;
        gsap.to(item, {
          scale: 0.94,
          duration: 0.15
        });
        gsap.killTweensOf(item, "x,y");
      });

      item.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var now = performance.now();
        var dt = Math.max(now - lastMoveTime, 1);
        var dx = e.clientX - ptrX;
        var dy = e.clientY - ptrY;

        vx = (dx - (x - startX)) / dt;
        vy = (dy - (y - startY)) / dt;

        x = startX + dx;
        y = startY + dy;

        // Clamp within the FULL .talk section, not just the .drag-item container.
        var rect = item.getBoundingClientRect();
        var minX = bounds.left - rect.left + x;
        var maxX = bounds.right - rect.right + x;
        var minY = bounds.top - rect.top + y;
        var maxY = bounds.bottom - rect.bottom + y;
        x = gsap.utils.clamp(minX, maxX, x);
        y = gsap.utils.clamp(minY, maxY, y);

        setX(x);
        setY(y);
        gsap.to(item, {
          rotation: gsap.utils.clamp(-15, 15, dx * 0.08),
          duration: 0.2
        });
        lastMoveTime = now;
      });

      function release() {
        if (!dragging) return;
        dragging = false;
        item.style.cursor = "grab";
        gsap.to(item, {
          scale: 1,
          duration: 0.25
        });

        var settleX = x + vx * 80;
        var settleY = y + vy * 80;
        var rect = item.getBoundingClientRect();
        var minX = bounds.left - rect.left + x;
        var maxX = bounds.right - rect.right + x;
        var minY = bounds.top - rect.top + y;
        var maxY = bounds.bottom - rect.bottom + y;
        settleX = gsap.utils.clamp(minX, maxX, settleX);
        settleY = gsap.utils.clamp(minY, maxY, settleY);

        gsap.to(item, {
          x: settleX,
          y: settleY,
          rotation: 0,
          duration: 0.6,
          ease: "power3.out",
          onUpdate: function () {
            x = gsap.getProperty(item, "x");
            y = gsap.getProperty(item, "y");
          }
        });
      }

      item.addEventListener("pointerup", release);
      item.addEventListener("pointercancel", release);
    }

    function enableDragging(secRect) {
      bounds = secRect;
      items.forEach(makeDraggable);
      initCursorTrail();
    }
  }

  /* -----------------------------------------------------------------------
     15. Page transitions
     ----------------------------------------------------------------------- */
  function initPageTransitions() {
    var overlay = qs("#site-loader");
    if (!overlay) return;

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;

      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === 0) return;
      if (link.target === "_blank") return;
      if (/^(tel:|mailto:|javascript:)/.test(href)) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.href === window.location.href) return;

      e.preventDefault();

      if (reduceMotion) {
        window.location.href = url.href;
        return;
      }

      overlay.style.display = "block";
      gsap.set(overlay, {
        clipPath: "circle(150% at 50% 50%)",
        autoAlpha: 1
      });
      var fill = qs(".loader-fill", overlay);
      var label = qs(".loader-label", overlay);
      var letters = qsa(".loader-letter", overlay);
      gsap.set(fill, {
        scaleX: 1,
        transformOrigin: "right center"
      });
      if (label) gsap.set(label, {
        autoAlpha: 1
      });
      if (letters.length) gsap.set(letters, {
        autoAlpha: 1,
        yPercent: 0
      });

      gsap.timeline({
        onComplete: function () {
          window.location.href = url.href;
        }
      }).to(fill, {
        scaleX: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });
    });
  }
  /* =========================================================
   SERVICES ANIMATIONS
========================================================= */

  function initServicesAnimations() {

    const cards = document.querySelectorAll(".service-list-card");

    if (!cards.length) return;


    /* -----------------------------------------------------
       CARD REVEAL
    ----------------------------------------------------- */

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 70,
        scale: 0.96
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,

        duration: 0.8,

        stagger: {
          amount: 0.8
        },

        ease: "power3.out",

        scrollTrigger: {
          trigger: ".services-head",
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       CARD HOVER
    ----------------------------------------------------- */

    cards.forEach((card) => {

      const number = card.querySelector(".num");
      const title = card.querySelector("h4");
      const arrow = card.querySelector(".arrow");


      card.addEventListener("mouseenter", () => {

        gsap.to(card, {
          y: -10,
          duration: 0.45,
          ease: "power3.out"
        });

        gsap.to(number, {
          scale: 1.08,
          rotation: 10,
          duration: 0.4,
          ease: "power3.out"
        });

        gsap.to(title, {
          x: 5,
          duration: 0.35,
          ease: "power2.out"
        });

        gsap.to(arrow, {
          x: 5,
          duration: 0.35,
          ease: "power2.out"
        });

      });


      card.addEventListener("mouseleave", () => {

        gsap.to(card, {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power3.out"
        });

        gsap.to(number, {
          scale: 1,
          rotation: 0,
          duration: 0.45,
          ease: "power3.out"
        });

        gsap.to(title, {
          x: 0,
          duration: 0.4,
          ease: "power2.out"
        });

        gsap.to(arrow, {
          x: 0,
          duration: 0.4,
          ease: "power2.out"
        });

      });


      /* -------------------------------------------------
         MOUSE 3D TILT
      ------------------------------------------------- */

      card.addEventListener("mousemove", (e) => {

        if (window.innerWidth < 768) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY =
          ((x / rect.width) - 0.5) * 5;

        const rotateX =
          ((y / rect.height) - 0.5) * -5;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,

          transformPerspective: 1000,

          duration: 0.4,

          ease: "power2.out"
        });

      });

    });

  }


  /* =========================================================
     SERVICE CARD MOUSE GLOW
  ========================================================= */

  function initServiceCardGlow() {

    const cards = document.querySelectorAll(".service-list-card");

    if (!cards.length) return;


    cards.forEach((card) => {

      const glow = document.createElement("span");

      glow.classList.add("shine");

      card.appendChild(glow);


      card.addEventListener("mousemove", (e) => {

        if (window.innerWidth < 768) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(glow, {
          x: x,
          y: y,

          duration: 0.3,

          ease: "power2.out"
        });

      });

    });

  }


  /* =========================================================
     SERVICES NUMBER ANIMATION
  ========================================================= */

  function initServiceNumberAnimation() {

    const numbers = document.querySelectorAll(
      ".service-list-card .num"
    );

    if (!numbers.length) return;


    numbers.forEach((number) => {

      gsap.fromTo(
        number,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -20
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,

          duration: 0.7,

          ease: "back.out(1.7)",

          scrollTrigger: {
            trigger: number,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

    });

  }
  /* =========================================================
     CONTACT FORM ANIMATION
  ========================================================= */

  function initContactAnimations() {

    const section = document.querySelector(".contact");

    if (!section) return;

    const form = section.querySelector(".contact-form");
    const info = section.querySelector(".contact-info-card");

    const fields = section.querySelectorAll(
      ".contact-form .form-control"
    );

    const button = section.querySelector(
      ".contact-form .web-btn"
    );

    const infoRows = section.querySelectorAll(
      ".info-row"
    );


    /* -----------------------------------------------------
       MAIN FORM REVEAL
    ----------------------------------------------------- */

    gsap.fromTo(
      form,
      {
        opacity: 0,
        x: -70,
        y: 30
      },
      {
        opacity: 1,
        x: 0,
        y: 0,

        duration: 0.9,

        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       CONTACT INFO REVEAL
    ----------------------------------------------------- */

    gsap.fromTo(
      info,
      {
        opacity: 0,
        x: 70,
        y: 30
      },
      {
        opacity: 1,
        x: 0,
        y: 0,

        duration: 0.9,

        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       FORM FIELDS STAGGER
    ----------------------------------------------------- */

    gsap.fromTo(
      fields,
      {
        opacity: 0,
        y: 25
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.6,

        stagger: 0.08,

        ease: "power2.out",

        scrollTrigger: {
          trigger: form,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       BUTTON
    ----------------------------------------------------- */

    gsap.fromTo(
      button,
      {
        opacity: 0,
        y: 20,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,

        duration: 0.6,

        delay: 0.35,

        ease: "back.out(1.5)",

        scrollTrigger: {
          trigger: form,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       INFO ROWS
    ----------------------------------------------------- */

    gsap.fromTo(
      infoRows,
      {
        opacity: 0,
        x: 25
      },
      {
        opacity: 1,
        x: 0,

        duration: 0.55,

        stagger: 0.12,

        ease: "power2.out",

        scrollTrigger: {
          trigger: info,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       INPUT FOCUS ANIMATION
    ----------------------------------------------------- */

    fields.forEach((field) => {

      field.addEventListener("focus", () => {

        gsap.to(field, {
          y: -2,
          duration: 0.3,
          ease: "power2.out"
        });

      });


      field.addEventListener("blur", () => {

        gsap.to(field, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });

      });

    });


    /* -----------------------------------------------------
       BUTTON HOVER
    ----------------------------------------------------- */

    button.addEventListener("mouseenter", () => {

      gsap.to(button, {
        y: -4,
        scale: 1.02,

        duration: 0.3,

        ease: "power2.out"
      });

    });


    button.addEventListener("mouseleave", () => {

      gsap.to(button, {
        y: 0,
        scale: 1,

        duration: 0.4,

        ease: "power3.out"
      });

    });


    /* -----------------------------------------------------
       CONTACT INFO HOVER
    ----------------------------------------------------- */

    infoRows.forEach((row) => {

      row.addEventListener("mouseenter", () => {

        gsap.to(row, {
          x: 6,

          duration: 0.3,

          ease: "power2.out"
        });

      });


      row.addEventListener("mouseleave", () => {

        gsap.to(row, {
          x: 0,

          duration: 0.35,

          ease: "power2.out"
        });

      });

    });

  }


  /* =========================================================
     CONTACT MOUSE GLOW
  ========================================================= */

  function initContactGlow() {

    const cards = document.querySelectorAll(
      ".contact-form, .contact-info-card"
    );

    cards.forEach((card) => {

      card.addEventListener("mousemove", (e) => {

        if (window.innerWidth < 768) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(card, {
          "--mouse-x": `${x}px`,
          "--mouse-y": `${y}px`,
          duration: 0.3,
          ease: "power2.out"
        });

      });

    });

  }
  /* =========================================================
   SERVICE FEATURES ANIMATION
========================================================= */

  function initFeatureAnimations() {

    const section = document.querySelector(".services-head");

    if (!section) return;

    const heading = section.querySelector("h2.web-title");

    const rows = section.querySelectorAll(".feature-row");

    if (!rows.length) return;


    /* -----------------------------------------------------
       HEADING
    ----------------------------------------------------- */

    gsap.fromTo(
      heading,
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.9,

        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       FEATURE ROWS
    ----------------------------------------------------- */

    gsap.fromTo(
      rows,
      {
        opacity: 0,
        x: 80
      },
      {
        opacity: 1,
        x: 0,

        duration: 0.75,

        stagger: 0.14,

        ease: "power3.out",

        scrollTrigger: {
          trigger: rows[0],
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       FEATURE HOVER
    ----------------------------------------------------- */

    rows.forEach((row) => {

      const index = row.querySelector(".index");
      const title = row.querySelector("h4");
      const content = row.querySelector("div");


      row.addEventListener("mouseenter", () => {

        gsap.to(index, {
          scale: 1.08,
          rotation: 10,

          duration: 0.35,

          ease: "power2.out"
        });


        gsap.to(title, {
          x: 5,

          duration: 0.3,

          ease: "power2.out"
        });


        gsap.to(content, {
          x: 3,

          duration: 0.3,

          ease: "power2.out"
        });

      });


      row.addEventListener("mouseleave", () => {

        gsap.to(index, {
          scale: 1,
          rotation: 0,

          duration: 0.4,

          ease: "power3.out"
        });


        gsap.to(title, {
          x: 0,

          duration: 0.4,

          ease: "power3.out"
        });


        gsap.to(content, {
          x: 0,

          duration: 0.4,

          ease: "power3.out"
        });

      });

    });

  }


  /* =========================================================
     PROCESS ANIMATION
  ========================================================= */

  function initProcessAnimations() {

    const section = document.querySelector(".process");

    if (!section) return;

    const heading = section.querySelector("h2.web-title");

    const steps = section.querySelectorAll(".process-step");


    /* -----------------------------------------------------
       HEADING
    ----------------------------------------------------- */

    gsap.fromTo(
      heading,
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.9,

        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       PROCESS CARDS
    ----------------------------------------------------- */

    gsap.fromTo(
      steps,
      {
        opacity: 0,
        y: 90,
        scale: 0.94
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,

        duration: 0.8,

        stagger: 0.15,

        ease: "power3.out",

        scrollTrigger: {
          trigger: steps[0],
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );


    /* -----------------------------------------------------
       PROCESS CARD HOVER
    ----------------------------------------------------- */

    steps.forEach((step) => {

      const number = step.querySelector(".step-num");
      const title = step.querySelector("h4");
      const text = step.querySelector("p");


      step.addEventListener("mouseenter", () => {

        gsap.to(step, {
          y: -10,

          duration: 0.4,

          ease: "power3.out"
        });


        gsap.to(number, {
          scale: 1.1,
          rotation: 10,

          duration: 0.4,

          ease: "back.out(1.5)"
        });


        gsap.to(title, {
          x: 4,

          duration: 0.3,

          ease: "power2.out"
        });


        gsap.to(text, {
          x: 3,

          duration: 0.3,

          ease: "power2.out"
        });

      });


      step.addEventListener("mouseleave", () => {

        gsap.to(step, {
          y: 0,

          duration: 0.5,

          ease: "power3.out"
        });


        gsap.to(number, {
          scale: 1,
          rotation: 0,

          duration: 0.45,

          ease: "power3.out"
        });


        gsap.to(title, {
          x: 0,

          duration: 0.4,

          ease: "power3.out"
        });


        gsap.to(text, {
          x: 0,

          duration: 0.4,

          ease: "power3.out"
        });

      });

    });

  }


  /* =========================================================
     PROCESS CARD MOUSE TILT
  ========================================================= */

  function initProcessTilt() {

    const steps = document.querySelectorAll(
      ".process-step"
    );

    if (!steps.length) return;


    steps.forEach((card) => {

      card.addEventListener("mousemove", (e) => {

        if (window.innerWidth < 768) return;


        const rect =
          card.getBoundingClientRect();


        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;


        const rotateY =
          ((x / rect.width) - 0.5) * 5;


        const rotateX =
          ((y / rect.height) - 0.5) * -5;


        gsap.to(card, {

          rotateX: rotateX,

          rotateY: rotateY,

          transformPerspective: 1000,

          duration: 0.4,

          ease: "power2.out"

        });

      });


      card.addEventListener("mouseleave", () => {

        gsap.to(card, {

          rotateX: 0,

          rotateY: 0,

          duration: 0.6,

          ease: "power3.out"

        });

      });

    });

  }





  /* -----------------------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------------------- */
  function initAll() {
    if (window.__cwCtx) window.__cwCtx.revert();

    window.__cwCtx = gsap.context(function () {
      initLoader();
      initLogoAnimation();
      initMenuAnimations();
      initMobileMenu();
      initHeaderAnimation();
      initHeroServices();
      initServiceAnimations();
      initServicesScroll();
      initServicesCursor();
      initScrollReveal();
      initBrandAnimation();
      initFeaturedWork();
      initContactAnimations();
      initContactGlow();
      initDragItems();
      initServicesAnimations();
      initServiceCardGlow();
      initServiceNumberAnimation();
      initFeatureAnimations();
      initProcessAnimations();
      initProcessTilt();
    });
  }

  function boot() {
    initLenis();
    initAll();
    initPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();