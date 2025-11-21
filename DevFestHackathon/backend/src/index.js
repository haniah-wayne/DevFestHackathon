import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

// static storage for uploaded files
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(__dirname, '..', 'storage')
app.use('/storage', express.static(STORAGE_DIR))

// routes
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import classRoutes from './routes/classes.js'
import submissionRoutes from './routes/submissions.js'
import aiRoutes from './routes/ai.js'

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/ai', aiRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`CampusForge API running on port ${port}`)
})
