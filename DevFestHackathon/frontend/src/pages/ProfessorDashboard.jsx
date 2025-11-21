import React, { useState } from 'react'
import api from '../utils/api'

export default function ProfessorDashboard(){
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')
  const [roster, setRoster] = useState('')
  const [msg, setMsg] = useState(null)
  const user = localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')) : null

  if(!user || user.role !== 'professor'){
    return (
      <div style={{ padding:120 }}>
        <div className="container">
          <h2>Professor Dashboard</h2>
          <p>You must be logged in as a professor to create classes. <a href="#/login">Login</a> or <a href="#/register">Register</a>.</p>
        </div>
      </div>
    )
  }

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    try{
      const payload = { professor_id: 'prof-unknown', name, semester, roster: roster.split(',').map(s=>s.trim()).filter(Boolean) }
      const res = await api.post('/classes', payload)
      setMsg('Class created')
      setName(''); setSemester(''); setRoster('')
    }catch(err){ setMsg(err.message) }
  }

  return (
    <div style={{ padding: 120 }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <h2>Create Class</h2>
        <form onSubmit={submit} style={{ display:'grid', gap:12 }}>
          <input placeholder="Class name" value={name} onChange={e=>setName(e.target.value)} style={{ padding:12, borderRadius:8, border:'none' }} />
          <input placeholder="Semester (e.g., Fall 2025)" value={semester} onChange={e=>setSemester(e.target.value)} style={{ padding:12, borderRadius:8, border:'none' }} />
          <input placeholder="Roster (comma-separated emails)" value={roster} onChange={e=>setRoster(e.target.value)} style={{ padding:12, borderRadius:8, border:'none' }} />
          <div>
            <button className="btn-primary" type="submit">Create Class</button>
          </div>
        </form>
        {msg && <div style={{ marginTop:12 }}>{msg}</div>}
      </div>
    </div>
  )
}
