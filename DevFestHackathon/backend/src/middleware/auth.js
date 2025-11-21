import jwt from 'jsonwebtoken'
import db from '../db.js'

const secret = process.env.JWT_SECRET || 'devsecret'

export default async function auth(req, res, next){
  const h = req.headers.authorization || ''
  const m = h.match(/^Bearer (.+)$/)
  if(!m) return res.status(401).json({ error: 'authorization required' })
  const token = m[1]
  try{
    const payload = jwt.verify(token, secret)
    await db.read()
    const user = db.data.users.find(u => u.id === payload.id)
    if(!user) return res.status(401).json({ error: 'invalid token' })
    req.user = user
    next()
  }catch(err){
    return res.status(401).json({ error: 'invalid token' })
  }
}
