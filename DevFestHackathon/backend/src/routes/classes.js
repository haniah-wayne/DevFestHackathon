import express from 'express'
import db from '../db.js'
import { generateId } from '../utils/id.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// create class (professor) — protected
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'professor') return res.status(403).json({ error: 'professor role required' })
  const { name, semester, roster } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  await db.read()
  const cls = { id: generateId(), professor_id: req.user.id, institution: req.body.institution || '', name, semester: semester || '', roster: roster || [], created_at: new Date().toISOString() }
  db.data.classes.push(cls)
  await db.write()
  res.json({ class: cls })
})

// list classes
router.get('/', async (req, res) => {
  await db.read()
  res.json({ classes: db.data.classes || [] })
})

export default router
