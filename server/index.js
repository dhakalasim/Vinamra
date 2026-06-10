import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory user store
const USERS = [
  { id: 1, email: 'student@vinamra.com', password: 'vinamra123', name: 'Student' },
  { id: 2, email: 'teacher@vinamra.com', password: 'teacher123', name: 'Teacher' },
];

// Simple token store (token -> userId)
const sessions = {};

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = generateToken();
  sessions[token] = user;
  res.json({ token, name: user.name, email: user.email });
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) delete sessions[token];
  res.json({ ok: true });
});

// GET /api/me  (verify token)
app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = sessions[token];
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ name: user.name, email: user.email });
});

app.listen(3001, () => console.log('✅  API server running on http://localhost:3001'));
