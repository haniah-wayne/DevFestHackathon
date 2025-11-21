import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import db from '../db.js'
import { generateId } from '../utils/id.js'
import auth from '../middleware/auth.js'

const router = express.Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(__dirname, '..', 'storage')
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, STORAGE_DIR)
  },
  filename: function (req, file, cb) {
    const unique = generateId()
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  }
})
const upload = multer({ storage })

// upload submission (student) — protected
router.post('/:projectId', auth, upload.array('files', 20), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'student role required' })
  const projectId = req.params.projectId
  const student_id = req.user.id
  await db.read()
  const project = db.data.projects.find(p => p.id === projectId)
  if (!project) return res.status(404).json({ error: 'project not found' })
  const file_paths = req.files.map(f => ({ original: f.originalname, path: path.relative(process.cwd(), f.path).replace(/\\/g, '/') }))
  const submission = {
    id: generateId(),
    student_id,
    project_id: projectId,
    timestamp: new Date().toISOString(),
    file_paths,
    ai_feedback: null,
    status: 'submitted'
  }
  db.data.submissions.push(submission)
  await db.write()
  res.json({ submission })
})

// list submissions for a project
router.get('/project/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  await db.read()
  const subs = db.data.submissions.filter(s => s.project_id === projectId)
  res.json({ submissions: subs })
})

export default router
