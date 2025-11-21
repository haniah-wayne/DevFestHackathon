import React, { useState } from 'react'
import api from '../utils/api'

export default function CompanyDashboard(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [compType, setCompType] = useState('none')
  const [msg, setMsg] = useState(null)
  const user = localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')) : null

  if(!user || user.role !== 'company'){
    return (
      <div style={{ padding:120 }}>
        <div className="container">
          <h2>Company Dashboard</h2>
          <p>You must be logged in as a company to create projects. <a href="#/login">Login</a> or <a href="#/register">Register</a>.</p>
        </div>
      </div>
    )
  }

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    try{
      const payload = { project_title: title, description, deadline, compensation_type: compType }
      const res = await api.post('/projects', payload)
      setMsg('Project created')
      setTitle(''); setDescription(''); setDeadline(''); setCompType('none')
    }catch(err){ setMsg(err.message) }
  }

  return (
    <div style={{ padding: 120 }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <h2>Create Project</h2>
        <form onSubmit={submit} style={{ display:'grid', gap:12 }}>
          <input placeholder="Project title" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding:12, borderRadius:8, border:'none' }} />
          <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding:12, borderRadius:8, border:'none', minHeight:140 }} />
          <div style={{ display:'flex', gap:8 }}>
            <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{ padding:12, borderRadius:8, border:'none' }} />
            <select value={compType} onChange={e=>setCompType(e.target.value)} style={{ padding:12, borderRadius:8 }}>
              <option value="none">No compensation</option>
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div>
            <button className="btn-primary" type="submit">Create Project</button>
          </div>
        </form>
        {msg && <div style={{ marginTop:12 }}>{msg}</div>}
      </div>
    </div>
  )
}
