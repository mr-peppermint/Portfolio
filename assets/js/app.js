/**
 * Portfolio interactions
 * ------------------------------------------------------------------
 * Content rendering, navigation, reveals, magnetic buttons, the
 * certificate dialog, and small quality-of-life details.
 */
(function () {
  "use strict";

  var cfg = window.PORTFOLIO || {};
  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = reduceQuery.matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  var $$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ------------------------------------------------------------------ */
  /* Content                                                             */
  /* ------------------------------------------------------------------ */

  $$("[data-name]").forEach(function (el) {
    el.textContent = cfg.name || "Your Name";
  });

  $$("[data-initials]").forEach(function (el) {
    if (el.id !== "ghAvatar") el.textContent = cfg.initials || "YN";
  });

  var roleEl = $("[data-role]");
  if (roleEl) roleEl.textContent = cfg.role || "Creative Developer";

  var locationEl = $("[data-location]");
  if (locationEl) locationEl.textContent = cfg.location || "Remote";

  var availabilityEl = $("[data-availability]");
  if (availabilityEl) availabilityEl.textContent = cfg.availability || "Available";

  var taglineEl = $("[data-tagline]");
  if (taglineEl) taglineEl.textContent = cfg.tagline || taglineEl.textContent;

  var emailText = $("#emailText");
  var emailLink = $("#emailLink");
  var email = cfg.email || "hello@yourname.dev";
  if (emailText) emailText.textContent = email;
  if (emailLink) emailLink.href = "mailto:" + email;

  document.title = (cfg.name || "Your Name") + " — " + (cfg.role || "Creative Developer");
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      "Portfolio of " + (cfg.name || "Your Name") + " — " + (cfg.role || "Creative Developer") + ". " + (cfg.tagline || "")
    );
  }

  /* Name split animation -------------------------------------------------- */

  var nameEl = $("[data-split]");
  if (nameEl) {
    var fullName = (cfg.name || nameEl.textContent || "Your Name").trim();
    nameEl.setAttribute("aria-label", fullName);
    nameEl.textContent = "";

    var words = fullName.split(/\s+/);
    var longest = words.reduce(function (max, word) {
      return Math.max(max, word.length);
    }, 0);

    if (longest > 9) nameEl.classList.add("hero-name--long");
    else if (longest > 6) nameEl.classList.add("hero-name--mid");

    words.forEach(function (word, wi) {
      var wordEl = document.createElement("span");
      wordEl.className = "word";
      Array.prototype.forEach.call(word, function (ch, ci) {
        var charEl = document.createElement("span");
        charEl.className = "char";
        charEl.setAttribute("aria-hidden", "true");
        charEl.textContent = ch;
        charEl.style.setProperty("--d", 180 + (wi * 2 + ci) * 46 + "ms");
        wordEl.appendChild(charEl);
      });
      nameEl.appendChild(wordEl);
    });
  }

  /* Socials --------------------------------------------------------------- */

  function socialsMarkup(compact) {
    return (cfg.socials || [])
      .map(function (s) {
        if (compact) {
          return (
            '<li><a href="' +
            esc(s.href) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(s.label) +
            ' <span aria-hidden="true">↗</span></a></li>'
          );
        }
        return (
          '<li><a href="' +
          esc(s.href) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<span class="social-short">' +
          esc(s.short || s.label.slice(0, 2)) +
          "</span><span>" +
          esc(s.label) +
          '</span><span class="social-arrow" aria-hidden="true">↗</span></a></li>'
        );
      })
      .join("");
  }

  var heroSocials = $("#heroSocials");
  if (heroSocials) heroSocials.innerHTML = socialsMarkup(true);

  var socials = $("#socials");
  if (socials) socials.innerHTML = socialsMarkup(false);

  /* Stats ----------------------------------------------------------------- */

  var statsEl = $("#stats");
  if (statsEl) {
    statsEl.innerHTML = (cfg.stats || [])
      .map(function (s) {
        return (
          '<li class="stat">' +
          '<span class="stat-number"><span class="stat-value" data-target="' +
          esc(s.value) +
          '">0</span><span class="stat-suffix">' +
          esc(s.suffix || "") +
          "</span></span>" +
          '<span class="stat-label">' +
          esc(s.label) +
          "</span></li>"
        );
      })
      .join("");
  }

  /* Skills ---------------------------------------------------------------- */

  var skillList = $("#skillList");
  if (skillList) {
    skillList.innerHTML = (cfg.skills || [])
      .map(function (skill) {
        return "<li>" + esc(skill) + "</li>";
      })
      .join("");
  }

  /* Projects -------------------------------------------------------------- */

  var projectGrid = $("#projectGrid");

  function renderProjects() {
    if (!projectGrid) return;
    projectGrid.innerHTML = (cfg.projects || [])
      .map(function (p, i) {
        var num = String(i + 1).padStart(2, "0");
        var tags = (p.tags || [])
          .map(function (tag) {
            return "<li>" + esc(tag) + "</li>";
          })
          .join("");
        return (
          '<article class="project" data-category="' +
          esc((p.categories || []).join(" ")) +
          '" style="--i:' +
          i +
          '">' +
          '<a class="project-link" href="' +
          esc(p.href || "#") +
          '" target="_blank" rel="noopener noreferrer">' +
          '<div class="project-visual" aria-hidden="true">' +
          '<span class="project-num">' +
          num +
          "</span>" +
          '<span class="project-glyph">' +
          esc(p.glyph || p.title.slice(0, 2).toUpperCase()) +
          "</span>" +
          '<span class="project-grid-lines"></span>' +
          '<span class="project-corner project-corner--tl"></span>' +
          '<span class="project-corner project-corner--br"></span>' +
          "</div>" +
          '<div class="project-body">' +
          '<div class="project-head"><h3>' +
          esc(p.title) +
          '</h3><span class="project-arrow" aria-hidden="true">↗</span></div>' +
          '<p class="project-desc">' +
          esc(p.description || "") +
          "</p>" +
          '<ul class="project-tags">' +
          tags +
          "</ul>" +
          '<div class="project-meta"><span>' +
          esc(p.year || "") +
          "</span><span>" +
          esc(p.role || "") +
          "</span></div>" +
          "</div>" +
          '<span class="sr-only">— view project, opens in a new tab</span>' +
          "</a></article>"
        );
      })
      .join("");
  }

  renderProjects();

  var chips = $$(".chip");
  var projects = $$(".project");

  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", chip.classList.contains("is-active") ? "true" : "false");
  });

  function applyFilter(filter) {
    projects.forEach(function (card) {
      var cats = (card.getAttribute("data-category") || "").split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && cats.indexOf(filter) === -1);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (other) {
        other.classList.toggle("is-active", other === chip);
        other.setAttribute("aria-pressed", other === chip ? "true" : "false");
      });
      applyFilter(chip.getAttribute("data-filter") || "all");
    });
  });

  /* Certificates ---------------------------------------------------------- */

  var certGrid = $("#certGrid");
  var dialog = $("#certDialog");
  var dialogTitle = $("#certDialogTitle");
  var dialogIssuer = $("#certDialogIssuer");
  var dialogDesc = $("#certDialogDesc");
  var dialogMeta = $("#certDialogMeta");
  var dialogLink = $("#certDialogLink");
  var dialogClose = $("#certClose");

  function issuerMark(issuer) {
    return String(issuer || "")
      .split(/\s+/)
      .slice(0, 2)
      .map(function (word) {
        return word.charAt(0);
      })
      .join("")
      .toUpperCase();
  }

  if (certGrid) {
    certGrid.innerHTML = (cfg.certificates || [])
      .map(function (c, i) {
        return (
          '<button class="cert-card" type="button" data-cert="' +
          i +
          '" aria-haspopup="dialog">' +
          '<span class="cert-visual" aria-hidden="true">' +
          '<span class="cert-top"><span>Certificate</span><span>' +
          esc(c.year || "") +
          "</span></span>" +
          '<span class="cert-emblem"><span>✦</span></span>' +
          '<span class="cert-issuer-mark">' +
          esc(issuerMark(c.issuer)) +
          "</span>" +
          '<span class="cert-bottom"><span>Verified</span><span>' +
          esc((c.credentialId || "").slice(-8)) +
          "</span></span>" +
          "</span>" +
          '<span class="cert-body">' +
          '<span class="cert-issuer">' +
          esc(c.issuer || "") +
          "</span>" +
          '<span class="cert-title">' +
          esc(c.title || "") +
          "</span>" +
          '<span class="cert-foot"><span>View credential</span><span aria-hidden="true">↗</span></span>' +
          '<span class="sr-only"> — opens details dialog</span>' +
          "</span></button>"
        );
      })
      .join("");
  }

  function openCert(index) {
    var cert = (cfg.certificates || [])[index];
    if (!cert || !dialog) return;

    if (dialogTitle) dialogTitle.textContent = cert.title || "Credential";
    if (dialogIssuer) dialogIssuer.textContent = cert.issuer || "";
    if (dialogDesc) dialogDesc.textContent = cert.description || "";

    var rows = [];
    if (cert.date) rows.push(["Issued", cert.date]);
    if (cert.credentialId) rows.push(["Credential ID", cert.credentialId]);
    if (cert.skills && cert.skills.length) rows.push(["Skills", cert.skills.join(" · ")]);

    if (dialogMeta) {
      dialogMeta.innerHTML = rows
        .map(function (row) {
          return (
            "<div><dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd></div>"
          );
        })
        .join("");
    }

    if (dialogLink) {
      var href = cert.href || "";
      var hasLink = href && href !== "#";
      dialogLink.style.display = hasLink ? "" : "none";
      if (hasLink) dialogLink.href = href;
      dialogLink.setAttribute("aria-label", "Verify " + (cert.title || "credential") + " (opens in a new tab)");
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      document.documentElement.classList.add("dialog-open");
    }
  }

  function closeCert() {
    if (!dialog) return;
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove("dialog-open");
  }

  if (certGrid) {
    certGrid.addEventListener("click", function (e) {
      var card = e.target.closest(".cert-card");
      if (!card) return;
      openCert(parseInt(card.getAttribute("data-cert"), 10));
    });
  }

  if (dialogClose) dialogClose.addEventListener("click", closeCert);

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeCert();
    });
    dialog.addEventListener("close", function () {
      document.documentElement.classList.remove("dialog-open");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */

  var nav = $("#siteNav");
  var navLinks = $("#navLinks");
  var navToggle = $("#navToggle");
  var scrollBar = $("#scrollBar");
  var navAnchors = $$("a", navLinks || document);

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.documentElement.classList.remove("menu-open");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = !navLinks.classList.contains("is-open");
      navLinks.classList.toggle("is-open", open);
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.documentElement.classList.toggle("menu-open", open);
    });

    navAnchors.forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  var scrollQueued = false;

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 16);
      if (scrollBar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var progress = max > 0 ? Math.min(1, y / max) : 0;
        scrollBar.style.transform = "scaleX(" + progress + ")";
      }
      if (navLinks && y < 180) {
        $$("a", navLinks).forEach(function (a) {
          a.classList.remove("is-active");
        });
      }
      scrollQueued = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section highlighting
  var sectionIds = ["work", "about", "achievements", "github", "contact"];
  var sectionObserver = null;

  if ("IntersectionObserver" in window && navLinks) {
    var navMap = {};
    $$("a", navLinks).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#") navMap[href.slice(1)] = a;
    });

    sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = navMap[entry.target.id];
          if (!link) return;
          $$("a", navLinks).forEach(function (a) {
            a.classList.toggle("is-active", a === link);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Reveals + counters                                                  */
  /* ------------------------------------------------------------------ */

  var revealEls = $$("[data-reveal]");
  var counterEls = $$(".stat-value");
  var countersDone = false;

  function runCounters() {
    if (countersDone || !counterEls.length) return;
    countersDone = true;

    counterEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      if (reduced) {
        el.textContent = String(Math.round(target));
        return;
      }
      var start = 0;
      var duration = 1400;

      function step(now) {
        if (!start) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = String(Math.round(target));
      }
      requestAnimationFrame(step);
    });
  }

  if ("IntersectionObserver" in window && !reduced) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    if (statsEl) {
      var statsObserver = new IntersectionObserver(
        function (entries, observer) {
          if (!entries[0].isIntersecting) return;
          runCounters();
          observer.disconnect();
        },
        { threshold: 0.4 }
      );
      statsObserver.observe(statsEl);
    }
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    runCounters();
  }

  /* ------------------------------------------------------------------ */
  /* Magnetic buttons + card spotlight                                   */
  /* ------------------------------------------------------------------ */

  if (!reduced && finePointer) {
    $$(".magnetic").forEach(function (el) {
      var rafId = 0;
      var tx = 0;
      var ty = 0;

      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        tx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        ty = (e.clientY - rect.top - rect.height / 2) * 0.22;
        if (!rafId) {
          rafId = requestAnimationFrame(function () {
            el.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
            rafId = 0;
          });
        }
      });

      el.addEventListener("pointerleave", function () {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        el.style.transform = "";
      });
    });
  }

  document.addEventListener(
    "pointermove",
    function (e) {
      var card = e.target.closest(".project, .cert-card, .repo:not(.repo--skeleton)");
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------ */
  /* Custom cursor                                                       */
  /* ------------------------------------------------------------------ */

  var cursor = $("#cursor");
  if (cursor && finePointer && !reduced) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var targetX = cx;
    var targetY = cy;
    var cursorRaf = 0;
    var cursorStarted = false;

    function cursorLoop() {
      cursorRaf = 0;
      cx += (targetX - cx) * 0.18;
      cy += (targetY - cy) * 0.18;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      if (Math.abs(targetX - cx) > 0.2 || Math.abs(targetY - cy) > 0.2) {
        cursorRaf = requestAnimationFrame(cursorLoop);
      }
    }

    document.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType === "touch") return;
        targetX = e.clientX;
        targetY = e.clientY;
        if (!cursorStarted) {
          cursorStarted = true;
          cx = targetX;
          cy = targetY;
          cursor.classList.add("is-active");
        }
        if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorLoop);
      },
      { passive: true }
    );

    document.addEventListener("pointerover", function (e) {
      if (e.target.closest("a, button, .chip")) cursor.classList.add("is-hover");
    });

    document.addEventListener("pointerout", function (e) {
      if (e.target.closest("a, button, .chip")) cursor.classList.remove("is-hover");
    });

    document.documentElement.addEventListener("pointerleave", function () {
      cursor.classList.remove("is-active");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Intro replay + copy email                                           */
  /* ------------------------------------------------------------------ */

  var hero = $(".hero");
  var replay = $("#replay");

  document.addEventListener("particles:formed", function () {
    if (hero) hero.classList.add("is-formed");
  });

  if (hero && reduced) hero.classList.add("is-formed");

  if (replay) {
    replay.addEventListener("click", function () {
      if (hero) hero.classList.remove("is-formed");
      if (window.ParticlePortrait) window.ParticlePortrait.replay();
    });
  }

  var toast = $("#toast");
  var toastTimer = 0;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  var copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        showToast("Email copied — " + email);
        var label = copyBtn.querySelector("span");
        if (label) {
          label.textContent = "Copied";
          setTimeout(function () {
            label.textContent = "Copy email";
          }, 1800);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          if (fallbackCopy(email)) done();
          else showToast("Couldn't copy — " + email);
        });
      } else if (fallbackCopy(email)) {
        done();
      } else {
        showToast("Couldn't copy — " + email);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Misc                                                                */
  /* ------------------------------------------------------------------ */

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Pause the custom cursor RAF when the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) closeMenu();
  });
})();
