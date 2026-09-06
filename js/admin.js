/* =====================================================
   Admin panel logic
   ===================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "philip_site_data";
  var ADMIN_PASSWORD = "philip123";

  /* ---------- Password gate ---------- */

  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = document.getElementById("password").value.trim();
    if (pw === ADMIN_PASSWORD) {
      try { sessionStorage.setItem("philip_admin", "1"); } catch (e) {}
      document.getElementById("lock-screen").classList.add("hidden");
      document.getElementById("panel").classList.remove("hidden");
      init();
    } else {
      var err = document.getElementById("login-error");
      err.classList.remove("hidden");
    }
  });

  /* ---------- Data helpers ---------- */

  function defaultColor(label) {
    var defaults = (window.PHILIP_DEFAULTS || {}).socials || [];
    for (var i = 0; i < defaults.length; i++) {
      if (defaults[i].label === label) return defaults[i].color;
    }
    return "#4b5563";
  }

  /* ---------- Render helpers ---------- */

  var tracksContainer = document.getElementById("tracks-list");
  var socialsContainer = document.getElementById("socials-list");
  var showsContainer = document.getElementById("shows-list");
  var pendingAudioDeletes = {};
  var sharedTrackAudio = {};

  function trackFields(track, index) {
    var div = document.createElement("div");
    div.className = "track-item";
    var id = track.id || uid();
    div.innerHTML =
      '<input type="hidden" class="t-id" value="' + esc(id) + '"/>' +
      '<input type="hidden" class="t-has-audio" value="' + (track.hasAudio ? "1" : "") + '"/>' +
      '<div class="track-title"><h3>Track ' + (index + 1) + "</h3>" +
      '<button type="button" class="item-remove" data-remove-track>Remove</button></div>' +
      '<label data-field-label="t-title">Title <span class="req">*</span><input type="text" class="t-title" data-required value="' + esc(track.title) + '"/></label>' +
      '<label>Type (e.g. "Afro-pop song")<input type="text" class="t-type" value="' + esc(track.type) + '"/></label>' +
      '<label>Description<textarea class="t-desc" rows="2">' + esc(track.desc) + "</textarea></label>" +
      '<label class="audio-field">Audio file ' +
      '<input type="file" class="t-audio" accept="audio/*" data-track-id="' + esc(id) + '"/>' +
      '<span class="audio-status">' + (track.hasAudio ? "A clip is currently attached. Pick a new file to replace it." : "No audio yet — pick an audio file (mp3, m4a, wav, ogg).") + "</span>" +
      "</label>";
    div.querySelector("[data-remove-track]").addEventListener("click", function () {
      // if a clip exists for this track, remove it too
      var existed = div.querySelector(".t-has-audio").value === "1";
      var tid = div.querySelector(".t-id").value;
      if (existed) pendingAudioDeletes[tid] = true;
      div.remove();
    });
    return div;
  }

  function uid() {
    return "tr-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function socialFields(social, index) {
    var div = document.createElement("div");
    div.className = "social-item";
    div.innerHTML =
      '<div class="social-label"><h3>' + esc(social.label) + "</h3>" +
      '<button type="button" class="item-remove" data-remove-social>Remove</button></div>' +
      '<input type="hidden" class="s-label" value="' + esc(social.label) + '"/>' +
      '<label>Profile URL<input type="url" class="s-url" value="' + esc(social.url) + '"/></label>' +
      '<input type="hidden" class="s-color" value="' + esc(social.color || defaultColor(social.label)) + '"/>';
    div.querySelector("[data-remove-social]").addEventListener("click", function () {
      div.remove();
    });
    return div;
  }

  function showFields(show, index) {
    var div = document.createElement("div");
    div.className = "show-item";
    var id = show.id || uid();
    div.innerHTML =
      '<div class="show-head"><h3>Show ' + (index + 1) + "</h3>" +
      '<button type="button" class="item-remove" data-remove-show>Remove</button></div>' +
      '<input type="hidden" class="sh-id" value="' + esc(id) + '"/>' +
      '<div class="row">' +
      '<label>Date<input type="text" class="sh-date" placeholder="e.g. October 12, 2026" value="' + esc(show.date || "") + '"/></label>' +
      '<label>Time<input type="text" class="sh-time" placeholder="e.g. 7:00 PM" value="' + esc(show.time || "") + '"/></label>' +
      "</div>" +
      '<label>Venue<input type="text" class="sh-venue" placeholder="e.g. Lot 12 Live Lounge" value="' + esc(show.venue || "") + '"/></label>' +
      '<label>City<input type="text" class="sh-city" placeholder="e.g. Kampala" value="' + esc(show.city || "") + '"/></label>' +
      '<label>Ticket link<input type="url" class="sh-link" placeholder="https://..." value="' + esc(show.link || "") + '"/></label>';
    div.querySelector("[data-remove-show]").addEventListener("click", function () {
      div.remove();
    });
    return div;
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Load current data into the form ---------- */

  function syncSourceSelect(key) {
    var sel = document.querySelector('[data-source="' + key + '"]');
    var url = document.querySelector('[data-field="' + key + '"]');
    var file = document.querySelector('[data-file="' + key + '"]');
    if (!sel) return;
    function show() {
      if (sel.value === "upload") {
        url.classList.add("hidden");
        file.classList.remove("hidden");
      } else {
        file.classList.add("hidden");
        url.classList.remove("hidden");
      }
    }
    sel.addEventListener("change", show);
    show();
  }

  function populate() {
    var d = window.PHILIP;

    var photo = document.querySelector('[data-field="photo"]');
    var aboutPhoto = document.querySelector('[data-field="aboutPhoto"]');
    var bgPhoto = document.querySelector('[data-field="bgPhoto"]');
    var whatsapp = document.querySelector('[data-field="whatsapp"]');
    var email = document.querySelector('[data-field="email"]');
    photo.value = d.photo || "";
    if (aboutPhoto) aboutPhoto.value = d.aboutPhoto || "";
    if (bgPhoto) bgPhoto.value = d.bgPhoto || "";
    whatsapp.value = d.whatsapp || "";
    email.value = d.email || "";

    ["photo", "bgPhoto", "aboutPhoto"].forEach(function (key) {
      var statusId = key === "photo" ? "photo-status" : (key === "bgPhoto" ? "bg-photo-status" : "about-photo-status");
      var status = document.getElementById(statusId);
      var file = document.querySelector('[data-file="' + key + '"]');
      if (file) file.value = "";
      var storeKey = key === "photo" ? "profile-photo" : (key === "bgPhoto" ? "hero-bg" : "about-photo");
      philibGetImageBlob(storeKey, function (err, blob) {
        if (status) {
          status.textContent = !err && blob && !(document.querySelector('[data-field="' + key + '"]').value)
            ? "An uploaded image is currently being used."
            : "";
        }
      });
      syncSourceSelect(key);
    });

    document.querySelector('[data-field="about1"]').value = d.about1 || "";
    document.querySelector('[data-field="about2"]').value = d.about2 || "";
    document.querySelector('[data-field="skills"]').value = (d.skills || []).join(", ");

    var tracks = (d.tracks || []).map(function (t) {
      return { id: t.id || uid(), title: t.title, type: t.type, desc: t.desc, hasAudio: false };
    });
    var pending = tracks.length;
    tracks.forEach(function (t) {
      philibGetClip(t.id, function (err, blob) {
        t.hasAudio = !err && !!blob;
        pending--;
        renderTracks(tracks, pending);
      });
    });
    if (tracks.length === 0) renderTracks(tracks, 0);

    socialsContainer.innerHTML = "";
    (d.socials || []).forEach(function (s, i) {
      socialsContainer.appendChild(socialFields(s, i));
    });

    showsContainer.innerHTML = "";
    if (showsContainer) {
      (d.shows || []).forEach(function (s, i) {
        showsContainer.appendChild(showFields(s, i));
      });
    }
  }

  function renderTracks(tracks, pending) {
    if (pending > 0) return;
    tracksContainer.innerHTML = "";
    tracks.forEach(function (t, i) {
      tracksContainer.appendChild(trackFields(t, i));
    });
  }

  /* ---------- Save ---------- */

  var PHOTO_KEY = "profile-photo";
  var HERO_BG_KEY = "hero-bg";
  var ABOUT_PHOTO_KEY = "about-photo";

  function save() {
    var photo = document.querySelector('[data-field="photo"]').value.trim();
    var aboutPhoto = document.querySelector('[data-field="aboutPhoto"]') ? document.querySelector('[data-field="aboutPhoto"]').value.trim() : "";
    var bgPhoto = document.querySelector('[data-field="bgPhoto"]').value.trim();
    var whatsapp = document.querySelector('[data-field="whatsapp"]').value.trim();
    var email = document.querySelector('[data-field="email"]').value.trim();
    var about1 = document.querySelector('[data-field="about1"]').value.trim();
    var about2 = document.querySelector('[data-field="about2"]').value.trim();
    var skills = document
      .querySelector('[data-field="skills"]')
      .value.split(",")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);

    var tracks = [];
    var audioOps = [];
    tracksContainer.querySelectorAll(".track-item").forEach(function (item) {
      var tid = item.querySelector(".t-id").value;
      tracks.push({
        id: tid,
        title: item.querySelector(".t-title").value.trim(),
        type: item.querySelector(".t-type").value.trim(),
        desc: item.querySelector(".t-desc").value.trim()
      });
      var fileInput = item.querySelector(".t-audio");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        audioOps.push({ id: tid, blob: fileInput.files[0] });
      }
    });

    var socials = [];
    socialsContainer.querySelectorAll(".social-item").forEach(function (item) {
      socials.push({
        label: item.querySelector(".s-label").value.trim(),
        url: item.querySelector(".s-url").value.trim(),
        color: item.querySelector(".s-color").value.trim() || defaultColor(item.querySelector(".s-label").value.trim())
      });
    });

    var shows = [];
    if (showsContainer) {
      showsContainer.querySelectorAll(".show-item").forEach(function (item) {
        var link = item.querySelector(".sh-link").value.trim();
        shows.push({
          id: item.querySelector(".sh-id").value,
          date: item.querySelector(".sh-date").value.trim(),
          time: item.querySelector(".sh-time").value.trim(),
          venue: item.querySelector(".sh-venue").value.trim(),
          city: item.querySelector(".sh-city").value.trim(),
          link: link
        });
      });
    }

    // Photo: a new uploaded file takes precedence over the URL field.
    var photoFile = document.querySelector('[data-file="photo"]');
    var photoUpload = croppedPhotoBlob ||
      (photoFile && photoFile.files && photoFile.files[0] ? photoFile.files[0] : null);
    if (photoUpload) photo = ""; // store as uploaded blob; clear URL
    croppedPhotoBlob = null;

    // Hero background: same rule.
    var bgPhotoFile = document.querySelector('[data-file="bgPhoto"]');
    var bgPhotoUpload = bgPhotoFile && bgPhotoFile.files && bgPhotoFile.files[0] ? bgPhotoFile.files[0] : null;
    if (bgPhotoUpload) bgPhoto = "";

    // About section photo: same rule.
    var aboutPhotoFile = document.querySelector('[data-file="aboutPhoto"]');
    var aboutPhotoUpload = aboutPhotoFile && aboutPhotoFile.files && aboutPhotoFile.files[0] ? aboutPhotoFile.files[0] : null;
    if (aboutPhotoUpload) aboutPhoto = "";

    var data = {
      version: 3,
      photo: photo,
      aboutPhoto: aboutPhoto,
      bgPhoto: bgPhoto,
      whatsapp: whatsapp,
      email: email,
      about1: about1,
      about2: about2,
      skills: skills,
      tracks: tracks,
      shows: shows,
      socials: socials
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      statusMsg("Could not save settings. Try again.", "error");
      return;
    }

    // Compose IndexedDB media operations: track audio + deletions + photo
    var ops = [];
    audioOps.forEach(function (op) { ops.push({ type: "clip", id: op.id, blob: op.blob }); });
    Object.keys(pendingAudioDeletes).forEach(function (tid) { ops.push({ type: "delClip", id: tid }); });

    if (photoUpload) {
      ops.push({ type: "photo", blob: photoUpload });
    } else if (photo) {
      // URL is provided -> remove any previously uploaded photo
      ops.push({ type: "delPhoto" });
    }

    if (bgPhotoUpload) {
      ops.push({ type: "bgPhoto", blob: bgPhotoUpload });
    } else if (bgPhoto) {
      ops.push({ type: "delBgPhoto" });
    }

    if (aboutPhotoUpload) {
      ops.push({ type: "aboutPhoto", blob: aboutPhotoUpload });
    } else if (aboutPhoto) {
      ops.push({ type: "delAboutPhoto" });
    }

    var done = 0;
    var total = ops.length;
    var anyMediaFail = false;
    function finish() {
      done++;
      if (done >= total) {
        statusMsg(anyMediaFail ? "Settings saved, but one media file could not be saved." : "Saved! Your website is updated.", anyMediaFail ? "error" : "success");
      }
    }
    if (total === 0) {
      statusMsg("Saved! Your website is updated.", "success");
      pendingAudioDeletes = {};
      return;
    }
    ops.forEach(function (op) {
      if (op.type === "delClip") {
        philibDeleteClip(op.id, function () { finish(); });
      } else if (op.type === "photo") {
        if (op.blob.size > 10 * 1024 * 1024) { anyMediaFail = true; finish(); return; }
        philibSaveImage(PHOTO_KEY, op.blob, function (err) { if (err) anyMediaFail = true; finish(); });
      } else if (op.type === "aboutPhoto") {
        if (op.blob.size > 10 * 1024 * 1024) { anyMediaFail = true; finish(); return; }
        philibSaveImage(ABOUT_PHOTO_KEY, op.blob, function (err) { if (err) anyMediaFail = true; finish(); });
      } else if (op.type === "bgPhoto") {
        if (op.blob.size > 10 * 1024 * 1024) { anyMediaFail = true; finish(); return; }
        philibSaveImage(HERO_BG_KEY, op.blob, function (err) { if (err) anyMediaFail = true; finish(); });
      } else if (op.type === "delBgPhoto") {
        philibDeleteImage(HERO_BG_KEY, function () { finish(); });
      } else if (op.type === "delAboutPhoto") {
        philibDeleteImage(ABOUT_PHOTO_KEY, function () { finish(); });
      } else if (op.type === "delPhoto") {
        philibDeleteImage(PHOTO_KEY, function () { finish(); });
      } else {
        if (op.blob.size > 25 * 1024 * 1024) { anyMediaFail = true; finish(); return; }
        philibSaveClip(op.id, op.blob, function (err) { if (err) anyMediaFail = true; finish(); });
      }
    });
    pendingAudioDeletes = {};
  }

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    pendingAudioDeletes = {};
    philibClearAllClips(function () {
      statusMsg("Reset to default content.", "success");
      // reload effective data now that overrides are gone
      window.PHILIP = window.PHILIP_DEFAULTS;
      populate();
    });
  }

  function statusMsg(text, type) {
    var el = document.getElementById("save-status");
    el.textContent = text;
    el.className = "save-status " + (type || "");
  }

  /* ---------- Validate required fields ---------- */

  function validateRequired() {
    var missing = [];

    document.querySelectorAll("input[data-required], textarea[data-required]").forEach(function (input) {
      var label = input.closest("label");
      var empty = !input.value.trim();
      if (label) label.classList.toggle("error", empty);
      if (empty) missing.push(input);
    });

    // Collect a human-readable list of missing labels
    var names = [];
    document.querySelectorAll(".error").forEach(function (label) {
      var text = label.childNodes[0] && label.childNodes[0].textContent
        ? label.childNodes[0].textContent.trim()
        : (label.textContent || "").trim();
      if (text && names.indexOf(text) === -1) names.push(text);
    });

    var banner = document.getElementById("required-banner");
    if (banner) {
      if (names.length) {
        banner.classList.remove("hidden");
        banner.querySelector("span").textContent = "Please fill in: " + names.join(", ") + ".";
      } else {
        banner.classList.add("hidden");
        banner.querySelector("span").textContent = "";
      }
    }
    return names;
  }

  /* ---------- Photo crop (Cropper.js) ---------- */

  var croppedPhotoBlob = null;
  var cropper = null;

  function initCropper() {
    var modal = document.getElementById("crop-modal");
    var img = document.getElementById("crop-image");
    var fileInput = document.querySelector('[data-file="photo"]');
    if (!modal || !img || !fileInput || typeof Cropper === "undefined") return;

    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      croppedPhotoBlob = null;
      var reader = new FileReader();
      reader.onload = function () {
        var url = reader.result;
        img.src = url;
        modal.classList.remove("hidden");
        if (cropper) cropper.destroy();
        cropper = new Cropper(img, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          zoomable: true,
          scalable: true,
          movable: true,
          rotatable: false
        });
      };
      reader.readAsDataURL(file);
    });

    document.getElementById("crop-zoom-in").addEventListener("click", function () {
      if (cropper) cropper.zoom(0.1);
    });
    document.getElementById("crop-zoom-out").addEventListener("click", function () {
      if (cropper) cropper.zoom(-0.1);
    });

    document.getElementById("crop-cancel").addEventListener("click", function () {
      modal.classList.add("hidden");
      if (cropper) { cropper.destroy(); cropper = null; }
      fileInput.value = "";
    });

    document.getElementById("crop-apply").addEventListener("click", function () {
      if (!cropper) return;
      var canvas = cropper.getCroppedCanvas({ width: 512, height: 512 });
      canvas.toBlob(function (blob) {
        croppedPhotoBlob = blob;
        modal.classList.add("hidden");
        if (cropper) { cropper.destroy(); cropper = null; }
        var pStatus = document.getElementById("photo-status");
        if (pStatus) pStatus.textContent = "Cropped photo is ready. Remember to save.";
      }, "image/jpeg", 0.92);
    });
  }

  /* ---------- Init ---------- */

  function init() {
    populate();
    validateRequired();
    initCropper();

    document.getElementById("btn-add-track").addEventListener("click", function () {
      tracksContainer.appendChild(trackFields({ title: "", type: "", desc: "" }, tracksContainer.children.length));
      validateRequired();
    });

    document.getElementById("btn-add-show").addEventListener("click", function () {
      if (showsContainer) showsContainer.appendChild(showFields({}, showsContainer.children.length));
    });

    document.getElementById("admin-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = validateRequired();
      if (missing.length) {
        var first = document.querySelector(".error");
        if (first && first.scrollIntoView) first.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      save();
    });

    document.getElementById("admin-form").addEventListener("input", validateRequired);

    document.getElementById("btn-reset").addEventListener("click", function () {
      if (confirm("Reset all website content back to the defaults?")) reset();
    });

    document.getElementById("btn-logout").addEventListener("click", logout);
  }

  function logout() {
    var pw = document.getElementById("password");
    if (pw) pw.value = "";
    var err = document.getElementById("login-error");
    if (err) err.classList.add("hidden");
    document.getElementById("panel").classList.add("hidden");
    document.getElementById("lock-screen").classList.remove("hidden");
    if (pw) pw.focus();
  }
})();
