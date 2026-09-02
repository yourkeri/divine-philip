// Netlify serverless function to store comments centrally in Netlify Blobs
// so comments are shared publicly across all visitors (not per-browser).

import { getStore } from '@netlify/blobs';

const STORE = 'divine-comments';
const KEY = 'comments';

export default async (req) => {
  const store = getStore(STORE);

  if (req.method === 'GET') {
    try {
      const raw = await store.get(KEY, { type: 'json' });
      const comments = Array.isArray(raw) ? raw : [];
      return Response.json({ comments });
    } catch (e) {
      return Response.json({ error: 'Failed to load comments', detail: String(e && e.message || e) }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const action = body.action || 'add';

      const raw = await store.get(KEY, { type: 'json' });
      let comments = Array.isArray(raw) ? raw : [];

      if (action === 'add') {
        const { name, text, replyTo } = body;
        if (!name || !text) {
          return Response.json({ error: 'Name and text are required' }, { status: 400 });
        }
        const comment = {
          id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          name: String(name).slice(0, 80),
          text: String(text).slice(0, 2000),
          date: new Date().toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
          likes: 0,
          replies: [],
          edited: false
        };
        if (replyTo) {
          const parent = comments.find((c) => c.id === replyTo);
          if (parent) {
            if (!Array.isArray(parent.replies)) parent.replies = [];
            comment.id = 'r-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            parent.replies.unshift(comment);
          } else {
            comments.unshift(comment);
          }
        } else {
          comments.unshift(comment);
        }
        await store.set(KEY, JSON.stringify(comments));
        return Response.json({ ok: true, comments });
      }

      if (action === 'edit') {
        const { id, text } = body;
        if (!id || !text) {
          return Response.json({ error: 'id and text are required' }, { status: 400 });
        }
        editById(comments, id, function (c) { c.text = String(text).slice(0, 2000); c.edited = true; });
        await store.set(KEY, JSON.stringify(comments));
        return Response.json({ ok: true, comments });
      }

      if (action === 'like') {
        const { id } = body;
        if (!id) {
          return Response.json({ error: 'id is required' }, { status: 400 });
        }
        var delta = body.liked ? 1 : -1;
        var found = false;
        editById(comments, id, function (c) {
          found = true;
          c.likes = Math.max(0, (c.likes || 0) + delta);
        });
        await store.set(KEY, JSON.stringify(comments));
        return Response.json({ ok: true, comments });
      }

      if (action === 'delete') {
        const { id } = body;
        if (!id) {
          return Response.json({ error: 'id is required' }, { status: 400 });
        }
        comments = comments.filter((c) => c.id !== id);
        await store.set(KEY, JSON.stringify(comments));
        return Response.json({ ok: true, comments });
      }

      return Response.json({ error: 'Unknown action' }, { status: 400 });
    } catch (e) {
      return Response.json({ error: 'Failed to save comment', detail: String(e && e.message || e) }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

function editById(comments, id, fn) {
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].id === id) { fn(comments[i]); return true; }
    if (comments[i].replies) {
      for (var j = 0; j < comments[i].replies.length; j++) {
        if (comments[i].replies[j].id === id) { fn(comments[i].replies[j]); return true; }
      }
    }
  }
  return false;
}
