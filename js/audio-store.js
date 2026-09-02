/* =====================================================
   Philip — Media storage (IndexedDB)
   Stores audio clips (mp3 etc.) and uploaded images.
   Regular localStorage is too small, so media lives in
   IndexedDB: audio keyed by track id, images by a name.
   ===================================================== */

var PHILIP_AUDIO_DB = "philip_audio";
var PHILIP_AUDIO_STORE = "clips";

function philibOpenAudio(cb) {
  var req = indexedDB.open(PHILIP_AUDIO_DB, 1);
  req.onupgradeneeded = function () {
    var db = req.result;
    if (!db.objectStoreNames.contains(PHILIP_AUDIO_STORE)) {
      db.createObjectStore(PHILIP_AUDIO_STORE);
    }
  };
  req.onsuccess = function () { cb(null, req.result); };
  req.onerror = function () { cb(req.error); };
}

/* Save a Blob audio clip for a track id. Resolves with a URL (or null). */
function philibSaveClip(trackId, blob, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readwrite");
    tx.objectStore(PHILIP_AUDIO_STORE).put(blob, String(trackId));
    tx.oncomplete = function () {
      var url = URL.createObjectURL(blob);
      if (cb) cb(null, url);
    };
    tx.onerror = function () { if (cb) cb(tx.error); };
  });
}

/* Fetch a clip for a track id as a Blob. */
function philibGetClip(trackId, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readonly");
    var req = tx.objectStore(PHILIP_AUDIO_STORE).get(String(trackId));
    req.onsuccess = function () { if (cb) cb(null, req.result || null); };
    req.onerror = function () { if (cb) cb(req.error); };
  });
}

/* Delete a clip for a track id. */
function philibDeleteClip(trackId, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readwrite");
    tx.objectStore(PHILIP_AUDIO_STORE).delete(String(trackId));
    tx.oncomplete = function () { if (cb) cb(null); };
    tx.onerror = function () { if (cb) cb(tx.error); };
  });
}

/* Delete all clips (used by "reset to defaults"). */
function philibClearAllClips(cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readwrite");
    tx.objectStore(PHILIP_AUDIO_STORE).clear();
    tx.oncomplete = function () { if (cb) cb(null); };
    tx.onerror = function () { if (cb) cb(tx.error); };
  });
}

/* ---------- Image storage (reuses the same IndexedDB) ----------
   Uploaded images (e.g. the profile photo) are stored as blobs
   under a name key. Used together with the photo URL field. */

function philibSaveImage(name, blob, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readwrite");
    tx.objectStore(PHILIP_AUDIO_STORE).put(blob, "img:" + name);
    tx.oncomplete = function () {
      var url = URL.createObjectURL(blob);
      if (cb) cb(null, url);
    };
    tx.onerror = function () { if (cb) cb(tx.error); };
  });
}

function philibGetImage(name, cb) {
  philibGetImageBlob(name, function (err, blob) {
    if (err || !blob) { if (cb) cb(err, null); return; }
    var url = URL.createObjectURL(blob);
    if (cb) cb(null, url);
  });
}

function philibGetImageBlob(name, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readonly");
    var req = tx.objectStore(PHILIP_AUDIO_STORE).get("img:" + name);
    req.onsuccess = function () { if (cb) cb(null, req.result || null); };
    req.onerror = function () { if (cb) cb(req.error); };
  });
}

function philibDeleteImage(name, cb) {
  philibOpenAudio(function (err, db) {
    if (err || !db) { if (cb) cb(err || new Error("no db")); return; }
    var tx = db.transaction(PHILIP_AUDIO_STORE, "readwrite");
    tx.objectStore(PHILIP_AUDIO_STORE).delete("img:" + name);
    tx.oncomplete = function () { if (cb) cb(null); };
    tx.onerror = function () { if (cb) cb(tx.error); };
  });
}
