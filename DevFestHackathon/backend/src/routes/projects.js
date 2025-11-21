import express from 'express'
import db from '../db.js'
import { generateId } from '../utils/id.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// create project (company) — protected
router.post('/', auth, async (req, res) => {
  const payload = req.body
  if (req.user.role !== 'company') return res.status(403).json({ error: 'company role required' })
  if (!payload.project_title || !payload.description || !payload.deadline) {
    return res.status(400).json({ error: 'project_title, description and deadline are required' })
  }
  await db.read()
  const project = {
    id: generateId(),
    company_id: req.user.id,
    project_title: payload.project_title,
    raw_description: payload.description,
    department: payload.department || null,
    skill_requirements: payload.skill_requirements || [],
    desired_lab_or_prof: payload.desired_lab_or_prof || null,
    deadline: payload.deadline,
    compensation_type: payload.compensation_type || 'none',
    status: 'open',
    created_at: new Date().toISOString(),
    ai_structured_description: null
  }
  db.data.projects.push(project)
  await db.write()
  res.json({ project })
})

// list projects
router.get('/', async (req, res) => {
  await db.read()
  res.json({ projects: db.data.projects || [] })
})

// get by id
router.get('/:id', async (req, res) => {
  const id = req.params.id
  await db.read()
  const p = db.data.projects.find(x => x.id === id)
  if (!p) return res.status(404).json({ error: 'not found' })
  res.json({ project: p })
})

export default router
