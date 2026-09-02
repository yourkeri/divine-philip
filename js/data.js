/* =====================================================
   Philip — Musician
   Content for customers.
   Defaults live here; any content saved via the admin
   section (stored in the browser) overrides these.
   ===================================================== */

var PHILIP_DEFAULTS = {
  whatsapp: "1234567890",
  email: "hello@philip-music.com",

  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB1NprtTRJb2SuSPG7YsW1_4E4lOC6F6tIFLlI2So5fwdhZx1NUbpZ9rJAlwMslxv_GGyfR7EREknfghVGFeC1Xjh57lapr6Cia8FmPfhBcIUYPMWMPE4JhGdTJaDXyagnbxl-LgwYQZh_VRH_CXRwkpN3oSKOTbN-ddNQ4Y21XNKQh-Q7qTBMixpr8DQLcMsZ4FEil4H_w-jKQh3RRhr84URAVDknWIjvaSipKH8PkpCToMrKjgZ0S",

  bgPhoto: "",

  about1:
    "I'm a musician and songwriter. I've been writing and performing music for a few years and love sharing original songs with new listeners — whether it's a heartfelt ballad, a joyful pop jam, or just a moment of inspiration.",
  about2:
    "You don't need to be a pro to enjoy good music. Just press play and let the feeling take over.",

  skills: ["Singing", "Songwriting", "Performing live", "Guitar"],

  shows: [
    {
      id: "show-1",
      date: "October 12, 2026",
      venue: "Lot 12 Live Lounge",
      city: "Kampala",
      time: "7:00 PM",
      link: "#"
    },
    {
      id: "show-2",
      date: "November 3, 2026",
      venue: "The Nile Stage",
      city: "Jinja",
      time: "8:00 PM",
      link: "#"
    },
    {
      id: "show-3",
      date: "November 21, 2026",
      venue: "Sky Bar Rooftop",
      city: "Kampala",
      time: "9:00 PM",
      link: "#"
    }
  ],

  tracks: [
    {
      id: "track-1",
      title: "Midnight Kampala",
      type: "Afro-pop song",
      desc: "A feel-good, energetic song with a deep groove."
    },
    {
      id: "track-2",
      title: "Urban Pulse",
      type: "Pop song",
      desc: "Heavy and smooth — great for singing along."
    },
    {
      id: "track-3",
      title: "Nile Vibes",
      type: "Acoustic track",
      desc: "Chill, flowing acoustic sounds to relax to."
    }
  ],

  socials: [
    { label: "Instagram", url: "#", color: "#E4405F" },
    { label: "TikTok", url: "#", color: "#010101" },
    { label: "Facebook", url: "#", color: "#1877F2" },
    { label: "YouTube", url: "#", color: "#FF0000" }
  ],

  socialIcons: {
    Instagram:
      '<path fill-rule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 4.837a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.406-.818a1.167 1.167 0 1 0 0 2.334 1.167 1.167 0 0 0 0-2.334zM12 8.95a3.05 3.05 0 1 1 0 6.1 3.05 3.05 0 0 1 0-6.1z" clip-rule="evenodd"/>',
    TikTok:
      '<path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
    Facebook:
      '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    YouTube:
      '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
  }
};

/* ---------- Apply admin-saved overrides from localStorage ---------- */

var PHILIP_DATA_VERSION = 3;

function philibLoadSaved() {
  try {
    var raw = JSON.parse(window.localStorage.getItem("philip_site_data"));
    if (!raw) return null;
    // Ignore content saved under an older layout (e.g. old "beat maker" wording)
    if (!raw.version || raw.version < PHILIP_DATA_VERSION) return null;
    return raw;
  } catch (e) {
    return null;
  }
}

function philibMerge(base, saved) {
  if (!saved) return base;
  var out = {};
  Object.keys(base).forEach(function (key) {
    // socialIcons are fixed brand icons; always keep defaults
    if (key === "socialIcons") { out[key] = base[key]; return; }
    out[key] = saved[key] !== undefined ? saved[key] : base[key];
  });
  return out;
}

window.PHILIP = philibMerge(PHILIP_DEFAULTS, philibLoadSaved());
