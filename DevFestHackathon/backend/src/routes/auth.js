import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { generateId } from '../utils/id.js'

const router = express.Router()

function isUniversityEmail(email) {
  // Basic check: .edu domain (MVP). Future: verify Michigan affiliation.
  return /@.+\.edu$/i.test(email)
}

router.post('/register', async (req, res) => {
  const { role, first_name, last_name, email, password, institution, company_name } = req.body
  if (!role || !email || !password) return res.status(400).json({ error: 'role, email, password required' })
  await db.read()
  const exists = db.data.users.find(u => u.email === email)
  if (exists) return res.status(409).json({ error: 'email already registered' })
  if ((role === 'student' || role === 'professor') && !isUniversityEmail(email)) {
    return res.status(400).json({ error: 'students and professors must register with a university (.edu) email for MVP' })
  }
  const password_hash = await bcrypt.hash(password, 10)
  const user = {
    id: generateId(),
    role,
    first_name: first_name || '',
    last_name: last_name || '',
    email,
    password_hash,
    institution: institution || company_name || '',
    created_at: new Date().toISOString()
  }
  db.data.users.push(user)
  await db.write()
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
  res.json({ user: { id: user.id, role: user.role, email: user.email, institution: user.institution }, token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  await db.read()
  const user = db.data.users.find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) return res.status(401).json({ error: 'invalid credentials' })
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
  res.json({ user: { id: user.id, role: user.role, email: user.email, institution: user.institution }, token })
})

export default router
