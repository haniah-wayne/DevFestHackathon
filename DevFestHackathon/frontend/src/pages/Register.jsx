import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Register(){
  const [role, setRole] = useState('student')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const payload = { role, first_name, last_name, email, password, institution }
      const res = await api.post('/auth/register', payload)
      if(res.user && res.token){
        localStorage.setItem('cf_token', res.token)
        localStorage.setItem('cf_user', JSON.stringify(res.user))
        navigate('/')
      }
    }catch(err){
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div style={{ padding: 120 }}>
      <div style={{ maxWidth:520, margin:'0 auto', background:'var(--color-card-bg)', padding:28, borderRadius:12 }}>
        <h2 style={{ marginTop:0 }}>Create account</h2>
        <form onSubmit={submit}>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{ padding:10, borderRadius:8 }}>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="company">Company</option>
            </select>
            <input placeholder="Institution / Company" value={institution} onChange={e=>setInstitution(e.target.value)} style={{ flex:1, padding:10, borderRadius:8 }} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input placeholder="First name" value={first_name} onChange={e=>setFirstName(e.target.value)} style={{ flex:1, padding:10, borderRadius:8 }} />
            <input placeholder="Last name" value={last_name} onChange={e=>setLastName(e.target.value)} style={{ flex:1, padding:10, borderRadius:8 }} />
          </div>
          <div style={{ marginTop:8 }}>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', padding:10, borderRadius:8 }} />
          </div>
          <div style={{ marginTop:8 }}>
            <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', padding:10, borderRadius:8 }} />
          </div>
          {error && <div style={{ color:'#FF6B6B' }}>{error}</div>}
          <div style={{ display:'flex', gap:10, marginTop:10 }}>
            <button className="btn-primary" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </div>
  )
}
