import express from 'express'
import db from '../db.js'

const router = express.Router()

// Simple AI parsing stub. By default AI integration is disabled to avoid external calls in deployment.
// Enable via environment variable USE_AI=true and implement IBM watsonx call here when ready.
router.post('/parse', async (req, res) => {
  const useAi = (process.env.USE_AI || 'false').toLowerCase() === 'true'
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'text required' })
  if (!useAi) {
    // Return a lightweight heuristic stub without calling external services
    return res.json({ disabled: true, message: 'AI features disabled in this deployment', summary: text?.slice(0, 300) })
  }
  // Placeholder for future IBM watsonx integration
  // When enabling, add secure credential handling and call the API here.
  return res.status(501).json({ error: 'AI integration not implemented' })
})

export default router
