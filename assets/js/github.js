/**
 * GitHub integration
 * ------------------------------------------------------------------
 * With `github.username` set, this file fetches the public profile,
 * repositories, and (when available) contribution activity.
 * Without it, the demo data in config.js is rendered instead.
 */
(function () {
  "use strict";

  var config = window.PORTFOLIO || {};
  var gh = config.github || {};
  var username = (gh.username || "").trim();

  var $ = function (id) {
    return document.getElementById(id);
  };

  var els = {
    avatar: $("ghAvatar"),
    name: $("ghName"),
    bio: $("ghBio"),
    link: $("ghLink"),
    mode: $("ghMode"),
    stats: $("ghStats"),
    heatmap: $("heatmap"),
    total: $("ghTotal"),
    repos: $("repoGrid"),
  };

  if (!els.heatmap || !els.repos) return;

  var nf = new Intl.NumberFormat("en-US");
  var levelCounts = [0, 1, 2, 4, 7];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function trim(value, length) {
    var s = String(value || "");
    return s.length > length ? s.slice(0, length - 1).trimEnd() + "…" : s;
  }

  function setMode(text) {
    if (els.mode) els.mode.textContent = text;
  }

  function formatRelative(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + "d ago";
    if (days < 365) return Math.round(days / 30) + "mo ago";
    return Math.round(days / 365) + "y ago";
  }

  /* ------------------------------------------------------------------ */
  /* Profile                                                             */
  /* ------------------------------------------------------------------ */

  function renderMockProfile() {
    var repos = (config.mockRepos || []).slice();
    var stars = repos.reduce(function (sum, r) {
      return sum + (r.stars || 0);
    }, 0);

    if (els.name) els.name.textContent = config.name || "Your Name";
    if (els.bio) els.bio.textContent = "Building small, sharp tools for the web.";
    if (els.link) {
      els.link.textContent = "@" + (gh.mockUsername || "yourhandle") + " ↗";
      els.link.href = gh.profileUrl || "https://github.com/";
    }
    if (els.avatar) {
      els.avatar.textContent = config.initials || "YN";
    }
    setMode("Demo data");
    renderStats([
      { value: "24", label: "Repositories" },
      { value: "186", label: "Followers" },
      { value: nf.format(stars), label: "Stars earned" },
    ]);
  }

  function renderLiveProfile(user) {
    if (els.name) els.name.textContent = user.name || user.login;
    if (els.bio) els.bio.textContent = user.bio || "Building things on the web.";
    if (els.link) {
      els.link.textContent = "@" + user.login + " ↗";
      els.link.href = user.html_url || "https://github.com/" + user.login;
    }
    if (els.avatar && user.avatar_url) {
      var img = document.createElement("img");
      img.src = user.avatar_url;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      els.avatar.textContent = "";
      els.avatar.dataset.initial = "";
      els.avatar.appendChild(img);
    }
    setMode("Live");
  }

  function renderStats(items) {
    if (!els.stats) return;
    els.stats.innerHTML = items
      .map(function (s) {
        return (
          '<li><span class="gh-stat-value">' +
          esc(s.value) +
          '</span><span class="gh-stat-label">' +
          esc(s.label) +
          "</span></li>"
        );
      })
      .join("");
  }

  /* ------------------------------------------------------------------ */
  /* Heatmap                                                             */
  /* ------------------------------------------------------------------ */

  function seedFrom(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Build the 53-week date grid used by both demo and live modes.
   * Cells are chronological, which maps cleanly to a column-flow grid.
   */
  function buildCalendar() {
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var endDay = today.getDay();
    var start = new Date(today);
    start.setDate(today.getDate() - (52 * 7 + endDay));

    function isoDate(date) {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      );
    }

    var cells = [];
    for (var w = 0; w < 53; w++) {
      for (var d = 0; d < 7; d++) {
        var date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        cells.push({
          date: date,
          iso: isoDate(date),
          future: date > today,
        });
      }
    }
    return cells;
  }

  function makeLevels(cells) {
    var rand = rng(seedFrom(username || gh.mockUsername || "monochrome"));
    var map = {};
    var streak = 0;
    var total = 0;

    cells.forEach(function (cell) {
      if (cell.future) {
        map[cell.iso] = -1;
        return;
      }
      var weekday = cell.date.getDay();
      var r = rand();
      var level = 0;

      if (streak > 0) {
        level = rand() > 0.22 ? Math.min(4, streak > 5 ? 3 : 2) : 0;
        streak = level > 0 ? streak + 1 : 0;
      } else if (weekday === 0 || weekday === 6) {
        level = r > 0.68 ? 1 : 0;
      } else {
        level = r > 0.86 ? (r > 0.975 ? 4 : r > 0.94 ? 3 : 2) : r > 0.58 ? 1 : 0;
      }

      if (level >= 2 && rand() > 0.7) streak = 1;
      map[cell.iso] = level;
      total += levelCounts[level];
    });

    return { map: map, total: total, demo: true };
  }

  function renderHeatmap(levels, cells, total, demo) {
    if (!els.heatmap) return;

    var html = "";
    cells.forEach(function (cell) {
      if (cell.future) {
        html += '<span class="cell cell--future"></span>';
        return;
      }
      var level = levels[cell.iso];
      if (level == null || level < 0) level = 0;
      var count = demo ? levelCounts[level] : levels[cell.iso + ":count"] || 0;
      var label =
        cell.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
        " — " +
        (count === 1 ? "1 contribution" : count + " contributions");
      html += '<span class="cell lvl-' + level + '" title="' + esc(label) + '"></span>';
    });

    els.heatmap.innerHTML = html;
    els.heatmap.setAttribute(
      "aria-label",
      total + " contributions in the last year" + (demo ? " (sample data)" : "")
    );
    if (els.total) {
      els.total.textContent = nf.format(total) + " contributions";
    }
  }

  function renderMockHeatmap() {
    var cells = buildCalendar();
    var data = makeLevels(cells);
    renderHeatmap(data.map, cells, data.total, true);
  }

  async function loadLiveHeatmap() {
    if (gh.useContributionApi === false || !username) return;

    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, 6000);

    try {
      var res = await fetch(
        "https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(username) + "?y=last",
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("contributions unavailable");
      var data = await res.json();
      var list = data.contributions || [];
      var map = {};
      var total = 0;

      list.forEach(function (day) {
        if (!day || !day.date) return;
        map[day.date] = typeof day.level === "number" ? day.level : 0;
        map[day.date + ":count"] = day.count || 0;
        total += day.count || 0;
      });

      var cells = buildCalendar();
      renderHeatmap(map, cells, total, false);
    } catch (err) {
      // The demo heatmap already rendered; leave it in place.
    } finally {
      clearTimeout(timer);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Repositories                                                        */
  /* ------------------------------------------------------------------ */

  function normalizeRepo(repo) {
    return {
      name: repo.name || "untitled",
      description: repo.description || "No description provided.",
      language: repo.language || "",
      stars: repo.stargazers_count != null ? repo.stargazers_count : repo.stars || 0,
      forks: repo.forks_count != null ? repo.forks_count : repo.forks || 0,
      updated: repo.pushed_at || repo.updated_at || repo.updated || "",
      url: repo.html_url || repo.url || "#",
      topics: (repo.topics || []).slice(0, 3),
    };
  }

  var LANG_OPACITY = [0.32, 0.48, 0.66, 0.88];

  function renderRepos(list) {
    if (!els.repos) return;
    var repos = list.map(normalizeRepo).slice(0, 6);

    els.repos.innerHTML = repos
      .map(function (repo) {
        var lang = repo.language || "Code";
        var tone = LANG_OPACITY[(lang.charCodeAt(0) + lang.length) % LANG_OPACITY.length];
        var topics = repo.topics.length
          ? '<div class="repo-topics">' +
            repo.topics
              .map(function (topic) {
                return "<span>" + esc(topic) + "</span>";
              })
              .join("") +
            "</div>"
          : "";

        return (
          '<article class="repo">' +
          '<a class="repo-link" href="' +
          esc(repo.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<div class="repo-head">' +
          '<svg class="repo-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>' +
          '<h3>' +
          esc(repo.name) +
          '</h3><span class="repo-arrow" aria-hidden="true">↗</span>' +
          "</div>" +
          '<p class="repo-desc">' +
          esc(trim(repo.description, 132)) +
          "</p>" +
          topics +
          '<div class="repo-meta">' +
          '<span class="repo-lang"><i class="lang-dot" style="opacity:' +
          tone +
          '"></i>' +
          esc(lang) +
          "</span>" +
          '<span class="repo-stat" title="Stars"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>' +
          nf.format(repo.stars) +
          "</span>" +
          '<span class="repo-stat" title="Forks"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>' +
          nf.format(repo.forks) +
          "</span>" +
          '<span class="repo-updated">' +
          esc(formatRelative(repo.updated)) +
          "</span>" +
          "</div>" +
          "</a></article>"
        );
      })
      .join("");
  }

  function renderSkeletons() {
    if (!els.repos) return;
    var html = "";
    for (var i = 0; i < 6; i++) {
      html +=
        '<div class="repo repo--skeleton" aria-hidden="true">' +
        '<span class="skeleton-line skeleton-line--short"></span>' +
        '<span class="skeleton-line"></span>' +
        '<span class="skeleton-line skeleton-line--mid"></span>' +
        '<span class="skeleton-line skeleton-line--tiny"></span>' +
        "</div>";
    }
    els.repos.innerHTML = html;
  }

  async function loadLiveRepos() {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, 9000);

    try {
      var urls = [
        "https://api.github.com/users/" + encodeURIComponent(username),
        "https://api.github.com/users/" +
          encodeURIComponent(username) +
          "/repos?per_page=100&sort=updated&type=owner",
      ];

      var responses = await Promise.all(
        urls.map(function (url) {
          return fetch(url, {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
          });
        })
      );

      if (!responses[0].ok || !responses[1].ok) throw new Error("GitHub unavailable");

      var user = await responses[0].json();
      var repos = await responses[1].json();
      if (!Array.isArray(repos)) throw new Error("Unexpected payload");

      var visible = repos.filter(function (repo) {
        return !repo.fork && !repo.archived;
      });

      var stars = visible.reduce(function (sum, repo) {
        return sum + (repo.stargazers_count || 0);
      }, 0);

      renderLiveProfile(user);
      renderStats([
        { value: nf.format(user.public_repos || visible.length), label: "Repositories" },
        { value: nf.format(user.followers || 0), label: "Followers" },
        { value: nf.format(stars), label: "Stars earned" },
      ]);

      visible.sort(function (a, b) {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      });
      renderRepos(visible);

      loadLiveHeatmap();
    } catch (err) {
      // Keep the demo content, but make the fallback explicit.
      setMode("Offline demo");
    } finally {
      clearTimeout(timer);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  renderMockProfile();
  renderMockHeatmap();
  renderRepos(config.mockRepos || []);

  if (username) {
    setMode("Live");
    renderSkeletons();
    loadLiveRepos();
  }
})();
