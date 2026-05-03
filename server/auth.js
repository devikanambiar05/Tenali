/**
 * Auth module — MongoDB-backed login for the Tenali site.
 *
 * Exposes:
 *   - connectMongo(uri):       Promise that resolves once Mongo is connected.
 *   - seedUsers():             Inserts the two hardcoded users if not present.
 *   - router (Express Router): /api/auth/login  POST {username, password}
 *                              /api/auth/me     GET  (requires Bearer token)
 *   - requireAuth (middleware): blocks if no/invalid Bearer token.
 *
 * Configuration (env):
 *   MONGO_URI  default mongodb://127.0.0.1:27017/tenali
 *   JWT_SECRET default 'tenali-dev-secret-change-me'
 *   JWT_TTL    default '14d'
 */

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tenali';
const JWT_SECRET = process.env.JWT_SECRET || 'tenali-dev-secret-change-me';
const JWT_TTL = process.env.JWT_TTL || '14d';

// ─── Mongoose schema ─────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// ─── Connection + seeding ────────────────────────────────────────────────────

let connected = false;

async function connectMongo(uri = MONGO_URI) {
  if (connected) return;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
  connected = true;
  console.log(`[auth] Mongo connected: ${uri.replace(/\/\/.*@/, '//***@')}`);
}

const SEED_USERS = [
  { username: 'sudarshan', password: 'sherlockholmes' },
  { username: 'tatsavit',  password: 'taittiriya' },
];

async function seedUsers() {
  for (const u of SEED_USERS) {
    const existing = await User.findOne({ username: u.username.toLowerCase() });
    if (existing) continue;
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username.toLowerCase(), passwordHash });
    console.log(`[auth] seeded user: ${u.username}`);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_TTL }
  );
}

function requireAuth(req, res, next) {
  const auth = req.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  if (!m) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (_e) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────

const router = express.Router();

router.post('/login', async (req, res) => {
  if (!connected) return res.status(503).json({ error: 'auth backend not connected' });
  const username = String((req.body || {}).username || '').trim().toLowerCase();
  const password = String((req.body || {}).password || '');
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: { username: user.username } });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { connectMongo, seedUsers, router, requireAuth, User };
