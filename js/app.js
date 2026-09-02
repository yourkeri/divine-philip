/* =====================================================
   Philip — Musician
   Simple page setup
   ===================================================== */

(function () {
  "use strict";

  var D = window.PHILIP;

  /* ---------- Music list ---------- */

  function renderMusic() {
    var el = document.getElementById("music-list");
    if (!el) return;

    el.innerHTML = D.tracks
      .map(function (t, i) {
        var tid = t.id || ("track-" + (i + 1));
        return (
          '<article class="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all duration-200">' +
          '<span class="shrink-0 w-10 text-center text-sm font-extrabold text-gray-300">' + ("0" + (i + 1)).slice(-2) + "</span>" +
          '<button type="button" data-track="' + tid + '" aria-label="Preview ' + t.title + '" class="shrink-0 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition-colors shadow-sm">' +
          '<svg data-symbol width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
          "</button>" +
          '<div class="min-w-0 flex-1">' +
          '<h3 class="font-bold text-sm text-gray-900 truncate">' + t.title + "</h3>" +
          '<p class="text-xs text-gray-500 truncate">' + t.desc + "</p>" +
          "</div>" +
          '<span class="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-brand-dark bg-brand-light/50 rounded-full px-2.5 py-1">' + t.type + "</span>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- Play buttons — play real audio clips (~15s) ---------- */

  var PREVIEW_SECONDS = 15;

  function initPlayers() {
    var playing = null;
    var currentAudio = null;

    var buttons = document.querySelectorAll("[data-track]");
    buttons.forEach(function (btn) {
      var tid = btn.getAttribute("data-track");
      var audio = null;
      var url = null;

      philibGetClip(tid, function (err, blob) {
        if (err || !blob) {
          // no clip uploaded — show a subtle "no preview available" state
          btn.classList.add("no-audio");
          btn.setAttribute("title", "No preview available for this track");
          btn.setAttribute("disabled", "disabled");
          btn.style.background = "#cbd5e1";
          return;
        }
        url = URL.createObjectURL(blob);
        audio = new Audio(url);
        audio.preload = "auto";
        audio.addEventListener("ended", function () {
          stopPlayback(btn, audio);
        });
      });

      btn.addEventListener("click", function () {
        if (!audio) return; // no clip loaded
        if (playing === btn) {
          stopPlayback(btn, audio);
          return;
        }
        // stop any other track
        if (playing && playing !== btn) stopPlayback(playing, currentAudio);

        audio.currentTime = 0;
        audio.play();
        playing = btn;
        currentAudio = audio;
        btn.querySelector("[data-symbol]").setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");

        // stop after ~15 seconds
        window.clearTimeout(btn._timeout);
        btn._timeout = window.setTimeout(function () {
          stopPlayback(btn, audio);
        }, PREVIEW_SECONDS * 1000);
      });
    });

    function stopPlayback(btn, audio) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (playing === btn) playing = null;
      if (currentAudio === audio) currentAudio = null;
      window.clearTimeout(btn._timeout);
      btn.querySelector("[data-symbol]").setAttribute("d", "M8 5v14l11-7z");
    }
  }

  /* ---------- Hero background ---------- */

  function renderHeroBg() {
    var bg = document.getElementById("hero-bg");
    if (!bg) return;
    function apply(url) {
      if (url) bg.style.backgroundImage = "url('" + url + "')";
    }
    if (D.bgPhoto) apply(D.bgPhoto);
    philibGetImageBlob("hero-bg", function (err, blob) {
      if (!err && blob) apply(URL.createObjectURL(blob));
    });
  }

  /* ---------- About ---------- */

  function renderAbout() {
    var photo = document.getElementById("about-photo");
    var headerPhoto = document.getElementById("header-photo");
    var heroPhoto = document.getElementById("hero-photo");

    // Use an uploaded profile photo if one exists, else the photo URL.
    function applyPhoto(src) {
      if (photo) photo.src = src;
      if (headerPhoto) headerPhoto.src = src;
      if (heroPhoto) heroPhoto.src = src;
    }
    if (D.photo) {
      applyPhoto(D.photo);
    }
    philibGetImageBlob("profile-photo", function (err, blob) {
      if (!err && blob) applyPhoto(URL.createObjectURL(blob));
    });
    var t1 = document.getElementById("about-text-1");
    if (t1) t1.textContent = D.about1;
    var t2 = document.getElementById("about-text-2");
    if (t2) t2.textContent = D.about2;

    var skills = document.getElementById("about-skills");
    if (skills) {
      skills.innerHTML = D.skills
        .map(function (s) {
          return '<span class="px-3 py-1 rounded-full bg-brand-light text-brand-dark text-sm font-medium">' + s + "</span>";
        })
        .join("");
    }
  }

  /* ---------- Contact links ---------- */

  function renderContact() {
    var wa = document.getElementById("contact-whatsapp");
    if (wa) wa.href = "https://wa.me/" + D.whatsapp;

    var em = document.getElementById("contact-email");
    if (em) em.href = "mailto:" + D.email;

    var socials = document.getElementById("footer-socials");
    if (socials) {
      socials.innerHTML = D.socials
        .map(function (s) {
          return '<a href="' + s.url + '" class="hover:text-brand-dark transition-colors">' + s.label + "</a>";
        })
        .join("");
    }

    // Icon buttons for the "Get in touch" section
    var contactSocials = document.getElementById("contact-socials");
    if (contactSocials) {
      contactSocials.innerHTML = D.socials
        .map(function (s) {
          var icon = D.socialIcons[s.label] || "";
          var color = s.color || "#4b5563";
          return (
            '<a href="' + s.url + '" aria-label="' + s.label + '" title="' + s.label +
            '" class="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-200" style="color:' + color +
            '" onmouseover="this.style.background=\'' + color + '\';this.style.color=\'#fff\';this.style.borderColor=\'' + color + '\'" onmouseout="this.style.background=\'\';this.style.color=\'' + color + '\';this.style.borderColor=\'\'">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' + icon + "</svg>" +
            "</a>"
          );
        })
        .join("");
    }
  }

  /* ---------- Contact form (opens email / WhatsApp) ---------- */

  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var msg =
        "Hi Philip, my name is " + data.get("name") +
        " (" + data.get("email") + "). " + data.get("message");
      var url = "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(msg);
      var note = document.getElementById("form-note");
      note.textContent = "Thanks! Opening WhatsApp so you can send the message.";
      window.open(url, "_blank");
      form.reset();
    });
  }

  /* ---------- Comments ---------- */

  function initComments() {
    var list = document.getElementById("comment-list");
    var form = document.getElementById("comment-form");
    var note = document.getElementById("comment-note");
    if (!list || !form) return;

    var comments = [];
    var myLiked = {};
    try { myLiked = JSON.parse(window.localStorage.getItem("philip_comment_likes")) || {}; } catch (e) { myLiked = {}; }
    var isAdmin = false;
    try { isAdmin = window.sessionStorage.getItem("philip_admin") === "1"; } catch (e) { isAdmin = false; }

    // Central store: comments now live on the server (Netlify Blobs) so they
    // are shared publicly by every visitor, not just saved in one browser.
    function api(action, payload) {
      return fetch("/.netlify/functions/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ action: action }, payload || {}))
      }).then(function (r) { return r.json(); });
    }

    function loadFromServer() {
      fetch("/.netlify/functions/comments")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          comments = (data && Array.isArray(data.comments)) ? data.comments : [];
          comments.forEach(function (c) {
            if (typeof c.likes !== "number") c.likes = 0;
            if (!Array.isArray(c.replies)) c.replies = [];
          });
          render();
        })
        .catch(function () { render(); });
    }

    function $esc(s) {
      if (typeof s !== "string") return "";
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Turn @mention text into a styled tag when rendering.
    function renderText(text) {
      var html = $esc(text).replace(/@([A-Za-z0-9_ .]+)/g, '<span class="inline-block bg-brand-light/60 text-brand-dark font-semibold rounded px-1 text-[13px]">@$1</span>');
      return html;
    }

    function likeBtn(c, isReply) {
      var liked = !!myLiked[c.id];
      var count = c.likes || 0;
      return (
        '<button type="button" data-like="' + c.id + '" class="' + (isReply ? "" : "comment-action ") + 'inline-flex items-center gap-1 text-sm font-medium ' +
        (liked ? "text-brand-dark" : "text-gray-500") + " hover:text-brand-dark transition-colors\">" +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (liked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
        "<span>" + count + "</span> Like</button>"
      );
    }

    function replyBtn(c) {
      return (
        '<button type="button" data-reply="' + c.id + '" class="comment-action inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        "Reply</button>"
      );
    }

    function renderReplies(replies) {
      if (!replies || !replies.length) return "";
      return replies.map(function (r) {
        var initial = (r.name || "?").trim().charAt(0).toUpperCase();
        return (
          '<div class="mt-3 pl-4 border-l-2 border-gray-100">' +
          '<div class="flex items-center gap-2">' +
          '<div class="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">' + $esc(initial) + "</div>" +
          '<p class="font-semibold text-sm text-gray-900 truncate">' + $esc(r.name) + "</p>" +
          '<span class="text-[11px] text-gray-400">' + $esc(r.date) + "</span>" +
          "</div>" +
          '<p class="mt-1 text-sm text-gray-600">' + renderText(r.text) + "</p>" +
          '<div class="mt-1">' + likeBtn(r, true) + "</div>" +
          "</div>"
        );
      }).join("");
    }

    function render() {
      if (!comments.length) {
        list.innerHTML = '<p class="text-gray-500 text-sm">No comments yet. Be the first to leave one!</p>';
        return;
      }
      list.innerHTML = comments.map(function (c) {
        var initial = (c.name || "?").trim().charAt(0).toUpperCase();
        var edited = c.edited ? ' <span class="text-gray-300 text-xs">(edited)</span>' : "";
        return (
          '<div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3" data-comment="' + c.id + '">' +
          '<div class="flex items-center gap-3">' +
          '<div class="w-11 h-11 rounded-full bg-brand-light text-brand-dark font-bold flex items-center justify-center shrink-0">' + $esc(initial) + "</div>" +
          '<div class="min-w-0 flex-1">' +
          '<p class="font-semibold text-gray-900 truncate"><span class="mr-1">' + $esc(c.name) + "</span>" + edited + "</p>" +
          '<p class="text-xs text-gray-400">' + $esc(c.date) + "</p>" +
          "</div>" +
          "</div>" +
          '<p class="text-gray-600 whitespace-pre-wrap">' + renderText(c.text) + "</p>" +
          '<div class="flex items-center gap-4 mt-1">' +
          likeBtn(c, false) + replyBtn(c) +
          '<button type="button" data-edit="' + c.id + '" class="comment-action text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">Edit</button>' +
          (isAdmin ? '<button type="button" data-delete="' + c.id + '" class="comment-action text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Delete</button>' : "") +
          "</div>" +
          renderReplies(c.replies) +
          "</div>"
        );
      }).join("");

      attachEvents();
    }

    function attachEvents() {
      var els = list.querySelectorAll("[data-like], [data-edit], [data-reply], [data-delete]");
      els.forEach(function (btn) {
        btn.addEventListener("click", function () { handleAction(btn); });
      });
    }

    function handleAction(btn) {
      if (btn.hasAttribute("data-like")) {
        var id = btn.getAttribute("data-like");
        // Toggle like
        myLiked[id] = !myLiked[id];
        try { window.localStorage.setItem("philip_comment_likes", JSON.stringify(myLiked)); } catch (e) {}
        api("like", { id: id, liked: myLiked[id] }).then(function (data) {
          if (data && Array.isArray(data.comments)) {
            comments = data.comments;
            render();
          }
        }).catch(function () { render(); });
      } else if (btn.hasAttribute("data-delete")) {
        if (!isAdmin) return;
        var delId = btn.getAttribute("data-delete");
        if (!window.confirm("Delete this comment?")) return;
        api("delete", { id: delId }).then(function (data) {
          if (data && Array.isArray(data.comments)) {
            comments = data.comments;
            render();
          }
        }).catch(function () { render(); });
      } else if (btn.hasAttribute("data-edit")) {
        editComment(btn.getAttribute("data-edit"));
      } else if (btn.hasAttribute("data-reply")) {
        startReply(btn.getAttribute("data-reply"));
      }
    }

    function findComment(id) {
      for (var i = 0; i < comments.length; i++) {
        if (comments[i].id === id) return comments[i];
        if (comments[i].replies) {
          for (var j = 0; j < comments[i].replies.length; j++) {
            if (comments[i].replies[j].id === id) return comments[i].replies[j];
          }
        }
      }
      return null;
    }

    function editComment(id) {
      var card = list.querySelector('[data-comment="' + id + '"]');
      if (!card) return;
      var target = findComment(id);
      if (!target) return;
      // Swap the text node for a textarea + save button
      var textP = card.querySelector("p.whitespace-pre-wrap");
      if (!textP) return;
      var textarea = document.createElement("textarea");
      textarea.className = "w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm resize-none";
      textarea.value = target.text;
      textarea.rows = 2;
      textP.replaceWith(textarea);
      var save = document.createElement("button");
      save.type = "button";
      save.className = "self-start px-4 py-1.5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors";
      save.textContent = "Save";
      save.addEventListener("click", function () {
        var val = textarea.value.trim();
        if (!val) return;
        api("edit", { id: id, text: val }).then(function (data) {
          if (data && Array.isArray(data.comments)) {
            comments = data.comments;
            render();
          }
        }).catch(function () { render(); });
      });
      textarea.after(save);
      textarea.focus();
    }

    function startReply(id) {
      var card = list.querySelector('[data-comment="' + id + '"]');
      if (!card) return;
      // Remove any existing reply box
      var existing = card.querySelector(".reply-box");
      if (existing) existing.remove();
      var box = document.createElement("div");
      box.className = "reply-box mt-3 space-y-2";
      box.innerHTML =
        '<input type="text" class="reply-name w-full px-3 py-2 rounded-xl border border-gray-300 text-sm" placeholder="Your name"/>' +
        '<textarea class="reply-text w-full px-3 py-2 rounded-xl border border-gray-300 text-sm resize-none" rows="2" placeholder="Reply, use @name to tag..."></textarea>' +
        '<button type="button" class="reply-send px-4 py-1.5 rounded-full bg-brand text-white text-sm font-semibold">Post reply</button>';
      card.appendChild(box);
      var send = box.querySelector(".reply-send");
      send.addEventListener("click", function () {
        var name = box.querySelector(".reply-name").value.trim();
        var text = box.querySelector(".reply-text").value.trim();
        if (!name || !text) return;
        var target = findComment(id);
        var replyToId = id;
        if (target && target.replies && box.getAttribute("data-replydepth") === "reply") {
          replyToId = id;
        }
        api("add", { name: name, text: text, replyTo: replyToId }).then(function (data) {
          if (data && Array.isArray(data.comments)) {
            comments = data.comments;
            render();
          }
        }).catch(function () { render(); });
      });
      box.querySelector(".reply-name").focus();
    }

    render();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#comment-name").value.trim();
      var text = form.querySelector("#comment-text").value.trim();
      if (!name || !text) return;
      var btn = form.querySelector("[type=submit]");
      if (btn) { btn.disabled = true; }
      api("add", { name: name, text: text }).then(function (data) {
        if (data && Array.isArray(data.comments)) {
          comments = data.comments;
          render();
        }
        form.reset();
        if (note) note.textContent = "Thanks! Your comment has been posted.";
      }).catch(function () {
        if (note) note.textContent = "Sorry, something went wrong. Please try again.";
      }).finally(function () {
        if (btn) { btn.disabled = false; }
      });
    });

    loadFromServer();
  }

  /* ---------- Live shows ---------- */

  function renderShows() {
    var el = document.getElementById("shows-list");
    if (!el) return;

    var shows = (D.shows || []).filter(function (s) { return s.venue; });
    if (!shows.length) {
      el.innerHTML = '<p class="text-gray-500 text-sm">No current show at the moment</p>';
      return;
    }

    el.innerHTML = shows
      .map(function (s, i) {
        return (
          '<div class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 max-w-md mx-auto hover:shadow-md transition-all duration-200">' +
          '<div class="shrink-0 w-14 h-14 rounded-xl bg-brand/10 text-brand-dark flex flex-col items-center justify-center">' +
          '<span class="text-[10px] font-bold uppercase leading-none">' + fmtTime(s.date) + "</span>" +
          '<span class="text-lg font-extrabold leading-tight mt-0.5">' + dayNum(s.date) + "</span>" +
          "</div>" +
          '<div class="min-w-0">' +
          '<h3 class="font-bold text-gray-900">' + s.venue + "</h3>" +
          '<p class="text-sm text-gray-500">' + s.city + (s.time ? " · " + s.time : "") + "</p>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function fmtTime(dateStr) {
    var m = /^([A-Za-z]+)/.exec(dateStr || "");
    return m ? m[1] : "";
  }

  function dayNum(dateStr) {
    var m = /(\d{1,2})/.exec(dateStr || "");
    return m ? m[1] : "";
  }

  /* ---------- Newsletter ---------- */

  var NEWSLETTER_KEY = "philip_newsletter";

  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector("#newsletter-email").value.trim();
      var note = document.getElementById("newsletter-note");
      if (!email) return;
      var subs = [];
      try {
        subs = JSON.parse(window.localStorage.getItem(NEWSLETTER_KEY)) || [];
      } catch (err) { subs = []; }
      if (subs.indexOf(email) === -1) subs.push(email);
      try {
        window.localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
      } catch (err) { /* ignore */ }
      if (note) {
        note.textContent = "You're subscribed! New releases coming soon.";
        note.classList.add("text-brand-dark", "font-semibold");
      }
      form.reset();
    });
  }

  /* ---------- Simple scroll reveal ---------- */

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderMusic();
    initPlayers();
    renderHeroBg();
    renderAbout();
    renderShows();
    renderContact();
    initForm();
    initComments();
    initNewsletter();
    initReveal();
  });
})();
