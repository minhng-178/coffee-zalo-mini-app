// In-memory cache of WeChat code2Session results, keyed by openid. Mirrors
// orderStore.js's shape/lifetime (lost on restart — fine for dev/no real
// merchant account yet). session_key must never be sent to the client; this
// exists so a future feature (e.g. decrypting wx.getUserProfile payloads)
// doesn't have to re-call code2Session.
const sessions = new Map();

function setSession(openid, sessionKey) {
  sessions.set(openid, { sessionKey, updatedAt: Date.now() });
}

function getSession(openid) {
  return sessions.get(openid);
}

module.exports = { setSession, getSession };
